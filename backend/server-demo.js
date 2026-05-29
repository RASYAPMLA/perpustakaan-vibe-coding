const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock data untuk demo
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@perpustakaan.com',
    role: 'admin',
    nama_lengkap: 'Administrator'
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@email.com',
    role: 'user',
    nama_lengkap: 'User Satu'
  }
];

const mockBooks = [
  {
    id: 1,
    judul: 'Laskar Pelangi',
    pengarang: 'Andrea Hirata',
    penerbit: 'Bentang Pustaka',
    tahun_terbit: 2005,
    isbn: '9789793062792',
    kategori_id: 1,
    nama_kategori: 'Fiksi',
    jumlah_total: 3,
    jumlah_tersedia: 3,
    lokasi_rak: 'A-001',
    deskripsi: 'Novel tentang kehidupan anak-anak di Belitung'
  },
  {
    id: 2,
    judul: 'Bumi Manusia',
    pengarang: 'Pramoedya Ananta Toer',
    penerbit: 'Hasta Mitra',
    tahun_terbit: 1980,
    isbn: '9789799731234',
    kategori_id: 1,
    nama_kategori: 'Fiksi',
    jumlah_total: 2,
    jumlah_tersedia: 2,
    lokasi_rak: 'A-002',
    deskripsi: 'Novel sejarah Indonesia'
  },
  {
    id: 3,
    judul: 'Clean Code',
    pengarang: 'Robert C. Martin',
    penerbit: 'Prentice Hall',
    tahun_terbit: 2008,
    isbn: '9780132350884',
    kategori_id: 3,
    nama_kategori: 'Teknologi',
    jumlah_total: 1,
    jumlah_tersedia: 1,
    lokasi_rak: 'B-001',
    deskripsi: 'Panduan menulis kode yang bersih dan maintainable'
  }
];

const mockCategories = [
  { id: 1, nama_kategori: 'Fiksi', deskripsi: 'Buku-buku fiksi dan novel' },
  { id: 2, nama_kategori: 'Non-Fiksi', deskripsi: 'Buku-buku non-fiksi dan referensi' },
  { id: 3, nama_kategori: 'Teknologi', deskripsi: 'Buku-buku tentang teknologi dan komputer' },
  { id: 4, nama_kategori: 'Sejarah', deskripsi: 'Buku-buku sejarah' },
  { id: 5, nama_kategori: 'Sains', deskripsi: 'Buku-buku sains dan penelitian' }
];

const mockLoans = [
  {
    id: 1,
    user_id: 2,
    buku_id: 1,
    nama_lengkap: 'User Satu',
    username: 'user1',
    judul: 'Laskar Pelangi',
    pengarang: 'Andrea Hirata',
    tanggal_pinjam: '2024-01-15',
    tanggal_kembali_rencana: '2024-01-29',
    tanggal_kembali_aktual: null,
    status: 'dipinjam',
    denda: 0,
    catatan: null
  }
];

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Backend server berjalan dengan baik (DEMO MODE)', 
    timestamp: new Date().toISOString(),
    mode: 'demo',
    note: 'Database belum terhubung - menggunakan mock data'
  });
});

// Auth routes (mock)
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (password !== 'password') {
    return res.status(400).json({ message: 'Username atau password salah' });
  }
  
  const user = mockUsers.find(u => u.username === username || u.email === username);
  if (!user) {
    return res.status(400).json({ message: 'Username atau password salah' });
  }
  
  res.json({
    token: 'mock-jwt-token-' + user.id,
    user: user
  });
});

app.post('/api/auth/register', (req, res) => {
  res.status(201).json({ message: 'User berhasil didaftarkan (DEMO)', userId: Date.now() });
});

app.get('/api/auth/me', (req, res) => {
  res.json(mockUsers[0]); // Return admin user
});

// Books routes
app.get('/api/buku', (req, res) => {
  const { search, kategori } = req.query;
  let filteredBooks = [...mockBooks];
  
  if (search) {
    filteredBooks = filteredBooks.filter(book => 
      book.judul.toLowerCase().includes(search.toLowerCase()) ||
      book.pengarang.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (kategori) {
    filteredBooks = filteredBooks.filter(book => book.kategori_id == kategori);
  }
  
  res.json(filteredBooks);
});

app.get('/api/buku/:id', (req, res) => {
  const book = mockBooks.find(b => b.id == req.params.id);
  if (!book) {
    return res.status(404).json({ message: 'Buku tidak ditemukan' });
  }
  res.json(book);
});

app.post('/api/buku', (req, res) => {
  res.status(201).json({ message: 'Buku berhasil ditambahkan (DEMO)', bookId: Date.now() });
});

// Categories routes
app.get('/api/kategori', (req, res) => {
  res.json(mockCategories);
});

app.post('/api/kategori', (req, res) => {
  res.status(201).json({ message: 'Kategori berhasil ditambahkan (DEMO)', categoryId: Date.now() });
});

// Loans routes
app.get('/api/peminjaman', (req, res) => {
  res.json(mockLoans);
});

app.post('/api/peminjaman', (req, res) => {
  res.status(201).json({ message: 'Peminjaman berhasil dibuat (DEMO)', loanId: Date.now() });
});

app.put('/api/peminjaman/:id/return', (req, res) => {
  res.json({ 
    message: 'Buku berhasil dikembalikan (DEMO)',
    fine: 0,
    daysOverdue: 0
  });
});

app.get('/api/peminjaman/stats', (req, res) => {
  res.json({
    totalLoans: 10,
    activeLoans: 3,
    overdueLoans: 1,
    totalUnpaidFines: 5000
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan server (DEMO MODE)' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server berjalan di port ${PORT} (DEMO MODE)`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`⚠️  DEMO MODE: Menggunakan mock data, database belum terhubung`);
  console.log(`🔧 Untuk menggunakan database, pastikan MySQL berjalan dan jalankan: npm run setup-db`);
});