const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all books
router.get('/', async (req, res) => {
  try {
    const { kategori, search } = req.query;
    let query = `
      SELECT b.*, k.nama_kategori 
      FROM buku b 
      LEFT JOIN kategori k ON b.kategori_id = k.id
    `;
    let params = [];

    if (kategori || search) {
      query += ' WHERE ';
      const conditions = [];
      
      if (kategori) {
        conditions.push('b.kategori_id = ?');
        params.push(kategori);
      }
      
      if (search) {
        conditions.push('(b.judul LIKE ? OR b.pengarang LIKE ?)');
        params.push(`%${search}%`, `%${search}%`);
      }
      
      query += conditions.join(' AND ');
    }

    query += ' ORDER BY b.created_at DESC';

    const [books] = await db.execute(query, params);
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get book by ID
router.get('/:id', async (req, res) => {
  try {
    const [books] = await db.execute(
      `SELECT b.*, k.nama_kategori 
       FROM buku b 
       LEFT JOIN kategori k ON b.kategori_id = k.id 
       WHERE b.id = ?`,
      [req.params.id]
    );

    if (books.length === 0) {
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }

    res.json(books[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new book (Admin only)
router.post('/', authenticateToken, requireAdmin, [
  body('judul').notEmpty().withMessage('Judul buku diperlukan'),
  body('pengarang').notEmpty().withMessage('Pengarang diperlukan'),
  body('jumlah_total').isInt({ min: 1 }).withMessage('Jumlah total minimal 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      judul, pengarang, penerbit, tahun_terbit, isbn,
      kategori_id, jumlah_total, lokasi_rak, deskripsi, cover_url
    } = req.body;

    const [result] = await db.execute(
      `INSERT INTO buku (judul, pengarang, penerbit, tahun_terbit, isbn, 
       kategori_id, jumlah_total, jumlah_tersedia, lokasi_rak, deskripsi, cover_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [judul, pengarang, penerbit || '', tahun_terbit || null, isbn || '',
       kategori_id || null, jumlah_total, jumlah_total, lokasi_rak || '', 
       deskripsi || '', cover_url || '']
    );

    res.status(201).json({ message: 'Buku berhasil ditambahkan', bookId: result.insertId });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'ISBN sudah digunakan' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update book (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      judul, pengarang, penerbit, tahun_terbit, isbn,
      kategori_id, jumlah_total, lokasi_rak, deskripsi, cover_url
    } = req.body;

    // Get current book data
    const [currentBooks] = await db.execute('SELECT * FROM buku WHERE id = ?', [req.params.id]);
    if (currentBooks.length === 0) {
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }

    const currentBook = currentBooks[0];
    const jumlah_tersedia = currentBook.jumlah_tersedia + (jumlah_total - currentBook.jumlah_total);

    await db.execute(
      `UPDATE buku SET judul = ?, pengarang = ?, penerbit = ?, tahun_terbit = ?, 
       isbn = ?, kategori_id = ?, jumlah_total = ?, jumlah_tersedia = ?, 
       lokasi_rak = ?, deskripsi = ?, cover_url = ? WHERE id = ?`,
      [judul, pengarang, penerbit || '', tahun_terbit || null, isbn || '',
       kategori_id || null, jumlah_total, Math.max(0, jumlah_tersedia), 
       lokasi_rak || '', deskripsi || '', cover_url || '', req.params.id]
    );

    res.json({ message: 'Buku berhasil diupdate' });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'ISBN sudah digunakan' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete book (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Check if book has active loans
    const [activeLoans] = await db.execute(
      'SELECT COUNT(*) as count FROM peminjaman WHERE buku_id = ? AND status = "dipinjam"',
      [req.params.id]
    );

    if (activeLoans[0].count > 0) {
      return res.status(400).json({ message: 'Tidak dapat menghapus buku yang sedang dipinjam' });
    }

    const [result] = await db.execute('DELETE FROM buku WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }

    res.json({ message: 'Buku berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;