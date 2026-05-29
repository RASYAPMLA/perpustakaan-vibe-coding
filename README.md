# Sistem Perpustakaan Digital

Aplikasi manajemen perpustakaan modern dengan React + Vite untuk frontend dan Express.js untuk backend, menggunakan MySQL sebagai database.

## 🚀 Fitur Utama

### Untuk User:
- **Registrasi dan Login** - Sistem autentikasi yang aman
- **Katalog Buku** - Jelajahi koleksi buku dengan pencarian dan filter
- **Peminjaman Buku** - Pinjam buku dengan sistem tanggal pengembalian
- **Dashboard Personal** - Pantau peminjaman aktif dan riwayat
- **Pengembalian Mandiri** - Kembalikan buku dengan catatan

### Untuk Admin:
- **Dashboard Admin** - Statistik dan overview sistem
- **Manajemen Buku** - CRUD buku dengan informasi lengkap
- **Manajemen Kategori** - Organisasi buku berdasarkan kategori
- **Manajemen Peminjaman** - Pantau dan kelola semua peminjaman
- **Sistem Denda** - Otomatis hitung denda keterlambatan

## 🛠️ Teknologi yang Digunakan

### Frontend:
- **React 18** - Library UI modern
- **Vite** - Build tool yang cepat
- **Tailwind CSS** - Styling utility-first
- **React Router** - Routing aplikasi
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **React Hot Toast** - Notifikasi
- **Lucide React** - Icon library

### Backend:
- **Node.js** - Runtime JavaScript
- **Express.js** - Web framework
- **MySQL** - Database relational
- **JWT** - Autentikasi token
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📋 Prasyarat

Pastikan Anda telah menginstal:
- **Node.js** (v16 atau lebih baru)
- **MySQL** (v8.0 atau lebih baru)
- **XAMPP/WAMP** (untuk phpMyAdmin)

## 🚀 Instalasi dan Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd perpustakaan-app
```

### 2. Install Dependencies
```bash
# Install dependencies untuk root project
npm install

# Install dependencies untuk backend
cd backend
npm install

# Install dependencies untuk frontend
cd ../frontend
npm install

# Kembali ke root directory
cd ..
```

### 3. Setup Database

#### A. Buat Database
1. Buka phpMyAdmin di `http://localhost:88/phpmyadmin/`
2. Login dengan kredensial MySQL Anda
3. Buat database baru dengan nama `db_perpustakaan`

#### B. Import Schema dan Data
1. Buka file `backend/config/setup-database.sql`
2. Copy semua isi file tersebut
3. Di phpMyAdmin, pilih database `db_perpustakaan`
4. Klik tab "SQL"
5. Paste script SQL dan klik "Go"

### 4. Konfigurasi Environment

#### Backend Environment
Buat file `.env` di folder `backend/` (sudah ada template):
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=db_perpustakaan
JWT_SECRET=perpustakaan_secret_key_2024
```

**Sesuaikan konfigurasi database:**
- `DB_USER`: Username MySQL Anda
- `DB_PASSWORD`: Password MySQL Anda (kosongkan jika tidak ada)
- `DB_HOST`: Ganti jika MySQL tidak di localhost

### 5. Jalankan Aplikasi

#### Opsi 1: Jalankan Semua Sekaligus (Recommended)
```bash
npm run dev
```

#### Opsi 2: Jalankan Terpisah
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 6. Akses Aplikasi

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **phpMyAdmin**: http://localhost:88/phpmyadmin/

## 👤 Akun Default

### Admin
- **Username**: `admin`
- **Password**: `password`
- **Email**: `admin@perpustakaan.com`

### User
- **Username**: `user1`
- **Password**: `password`
- **Email**: `user1@email.com`

## 📊 Struktur Database

### Tabel Utama:
- **users** - Data pengguna (admin & user)
- **kategori** - Kategori buku
- **buku** - Data buku
- **peminjaman** - Transaksi peminjaman
- **denda** - Data denda keterlambatan

### Relasi:
- User → Peminjaman (One to Many)
- Buku → Peminjaman (One to Many)
- Kategori → Buku (One to Many)
- Peminjaman → Denda (One to One)

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Registrasi user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Buku
- `GET /api/buku` - Get all books
- `GET /api/buku/:id` - Get book by ID
- `POST /api/buku` - Add new book (Admin)
- `PUT /api/buku/:id` - Update book (Admin)
- `DELETE /api/buku/:id` - Delete book (Admin)

### Peminjaman
- `GET /api/peminjaman` - Get loans
- `POST /api/peminjaman` - Create loan
- `PUT /api/peminjaman/:id/return` - Return book
- `GET /api/peminjaman/stats` - Get statistics (Admin)

### Kategori
- `GET /api/kategori` - Get all categories
- `POST /api/kategori` - Add category (Admin)
- `PUT /api/kategori/:id` - Update category (Admin)
- `DELETE /api/kategori/:id` - Delete category (Admin)

## 🎯 Fitur Sesuai Flowchart

Aplikasi ini dibangun berdasarkan flowchart yang Anda berikan dengan implementasi:

### Proses Peminjaman:
1. **Input Data Koleksi** → Form tambah buku (Admin)
2. **Form Request** → Form peminjaman buku (User)
3. **Validasi Tersedia** → Cek ketersediaan buku
4. **Update Koleksi** → Kurangi stok buku tersedia
5. **Generate Output** → Data peminjaman, KTM, NPM

### Proses Pengembalian:
1. **Input Buku** → Scan/pilih buku yang dikembalikan
2. **Validasi** → Cek status peminjaman
3. **Cek Keterlambatan** → Hitung denda jika terlambat
4. **Update Status** → Kembalikan stok, update status
5. **Generate Output** → Bukti pengembalian, data denda

## 🔒 Keamanan

- **Password Hashing** dengan bcryptjs
- **JWT Authentication** untuk session management
- **Input Validation** di frontend dan backend
- **SQL Injection Protection** dengan prepared statements
- **CORS Configuration** untuk keamanan cross-origin

## 🚀 Deployment

### Persiapan Production:
1. Update environment variables
2. Build frontend: `cd frontend && npm run build`
3. Setup reverse proxy (Nginx/Apache)
4. Configure SSL certificate
5. Setup database backup

## 🤝 Kontribusi

1. Fork repository
2. Buat feature branch
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## 📝 Lisensi

MIT License - Lihat file LICENSE untuk detail.

## 🆘 Troubleshooting

### Database Connection Error:
- Pastikan MySQL berjalan
- Cek kredensial di file `.env`
- Pastikan database `db_perpustakaan` sudah dibuat

### Port Already in Use:
- Ganti port di `backend/.env` dan `frontend/vite.config.js`
- Atau stop aplikasi yang menggunakan port tersebut

### Module Not Found:
- Jalankan `npm install` di folder yang sesuai
- Hapus `node_modules` dan `package-lock.json`, lalu install ulang

## 📞 Support

Jika mengalami masalah, silakan:
1. Cek dokumentasi ini
2. Lihat console error di browser/terminal
3. Buat issue di repository

---

**Selamat menggunakan Sistem Perpustakaan Digital! 📚**