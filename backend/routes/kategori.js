const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const [categories] = await db.execute('SELECT * FROM kategori ORDER BY nama_kategori');
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new category (Admin only)
router.post('/', authenticateToken, requireAdmin, [
  body('nama_kategori').notEmpty().withMessage('Nama kategori diperlukan')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nama_kategori, deskripsi } = req.body;

    const [result] = await db.execute(
      'INSERT INTO kategori (nama_kategori, deskripsi) VALUES (?, ?)',
      [nama_kategori, deskripsi || '']
    );

    res.status(201).json({ 
      message: 'Kategori berhasil ditambahkan', 
      categoryId: result.insertId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update category (Admin only)
router.put('/:id', authenticateToken, requireAdmin, [
  body('nama_kategori').notEmpty().withMessage('Nama kategori diperlukan')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nama_kategori, deskripsi } = req.body;

    const [result] = await db.execute(
      'UPDATE kategori SET nama_kategori = ?, deskripsi = ? WHERE id = ?',
      [nama_kategori, deskripsi || '', req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }

    res.json({ message: 'Kategori berhasil diupdate' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete category (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Check if category has books
    const [books] = await db.execute(
      'SELECT COUNT(*) as count FROM buku WHERE kategori_id = ?',
      [req.params.id]
    );

    if (books[0].count > 0) {
      return res.status(400).json({ 
        message: 'Tidak dapat menghapus kategori yang masih memiliki buku' 
      });
    }

    const [result] = await db.execute('DELETE FROM kategori WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }

    res.json({ message: 'Kategori berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;