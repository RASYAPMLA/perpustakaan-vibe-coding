const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all loans (Admin) or user's loans (User)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let query = `
      SELECT p.*, u.nama_lengkap, u.username, b.judul, b.pengarang
      FROM peminjaman p
      JOIN users u ON p.user_id = u.id
      JOIN buku b ON p.buku_id = b.id
    `;
    let params = [];

    if (req.user.role === 'user') {
      query += ' WHERE p.user_id = ?';
      params.push(req.user.id);
    }

    query += ' ORDER BY p.created_at DESC';

    const [loans] = await db.execute(query, params);
    res.json(loans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new loan
router.post('/', authenticateToken, [
  body('buku_id').isInt().withMessage('ID buku diperlukan'),
  body('tanggal_kembali_rencana').isDate().withMessage('Tanggal kembali rencana diperlukan')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { buku_id, tanggal_kembali_rencana } = req.body;
    const user_id = req.user.id;

    // Check if book is available
    const [books] = await db.execute(
      'SELECT * FROM buku WHERE id = ? AND jumlah_tersedia > 0',
      [buku_id]
    );

    if (books.length === 0) {
      return res.status(400).json({ message: 'Buku tidak tersedia atau tidak ditemukan' });
    }

    // Check if user has unpaid fines
    const [unpaidFines] = await db.execute(`
      SELECT COUNT(*) as count FROM denda d
      JOIN peminjaman p ON d.peminjaman_id = p.id
      WHERE p.user_id = ? AND d.status_bayar = 'belum_bayar'
    `, [user_id]);

    if (unpaidFines[0].count > 0) {
      return res.status(400).json({ message: 'Anda memiliki denda yang belum dibayar' });
    }

    // Check if user already borrowed this book and hasn't returned it
    const [activeLoan] = await db.execute(
      'SELECT * FROM peminjaman WHERE user_id = ? AND buku_id = ? AND status = "dipinjam"',
      [user_id, buku_id]
    );

    if (activeLoan.length > 0) {
      return res.status(400).json({ message: 'Anda sudah meminjam buku ini' });
    }

    // Start transaction
    await db.execute('START TRANSACTION');

    try {
      // Create loan record
      const [loanResult] = await db.execute(
        'INSERT INTO peminjaman (user_id, buku_id, tanggal_pinjam, tanggal_kembali_rencana) VALUES (?, ?, CURDATE(), ?)',
        [user_id, buku_id, tanggal_kembali_rencana]
      );

      // Update book availability
      await db.execute(
        'UPDATE buku SET jumlah_tersedia = jumlah_tersedia - 1 WHERE id = ?',
        [buku_id]
      );

      await db.execute('COMMIT');

      res.status(201).json({ 
        message: 'Peminjaman berhasil dibuat', 
        loanId: loanResult.insertId 
      });
    } catch (error) {
      await db.execute('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Return book
router.put('/:id/return', authenticateToken, async (req, res) => {
  try {
    const loanId = req.params.id;
    const { catatan } = req.body;

    // Get loan details
    const [loans] = await db.execute(`
      SELECT p.*, b.judul FROM peminjaman p
      JOIN buku b ON p.buku_id = b.id
      WHERE p.id = ? AND p.status = 'dipinjam'
    `, [loanId]);

    if (loans.length === 0) {
      return res.status(404).json({ message: 'Peminjaman tidak ditemukan atau sudah dikembalikan' });
    }

    const loan = loans[0];

    // Check if user owns this loan (unless admin)
    if (req.user.role === 'user' && loan.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }

    // Calculate fine if overdue
    const today = new Date();
    const dueDate = new Date(loan.tanggal_kembali_rencana);
    const isOverdue = today > dueDate;
    const daysOverdue = isOverdue ? Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24)) : 0;
    const fineAmount = daysOverdue * 1000; // Rp 1000 per hari

    // Start transaction
    await db.execute('START TRANSACTION');

    try {
      // Update loan status
      const status = isOverdue ? 'terlambat' : 'dikembalikan';
      await db.execute(
        'UPDATE peminjaman SET status = ?, tanggal_kembali_aktual = CURDATE(), denda = ?, catatan = ? WHERE id = ?',
        [status, fineAmount, catatan || '', loanId]
      );

      // Create fine record if overdue
      if (isOverdue && fineAmount > 0) {
        await db.execute(
          'INSERT INTO denda (peminjaman_id, jumlah_denda) VALUES (?, ?)',
          [loanId, fineAmount]
        );
      }

      // Update book availability
      await db.execute(
        'UPDATE buku SET jumlah_tersedia = jumlah_tersedia + 1 WHERE id = ?',
        [loan.buku_id]
      );

      await db.execute('COMMIT');

      res.json({ 
        message: 'Buku berhasil dikembalikan',
        fine: fineAmount,
        daysOverdue: daysOverdue
      });
    } catch (error) {
      await db.execute('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get loan statistics (Admin only)
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [totalLoans] = await db.execute('SELECT COUNT(*) as count FROM peminjaman');
    const [activeLoans] = await db.execute('SELECT COUNT(*) as count FROM peminjaman WHERE status = "dipinjam"');
    const [overdueLoans] = await db.execute('SELECT COUNT(*) as count FROM peminjaman WHERE status = "terlambat"');
    const [totalFines] = await db.execute('SELECT SUM(jumlah_denda) as total FROM denda WHERE status_bayar = "belum_bayar"');

    res.json({
      totalLoans: totalLoans[0].count,
      activeLoans: activeLoans[0].count,
      overdueLoans: overdueLoans[0].count,
      totalUnpaidFines: totalFines[0].total || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;