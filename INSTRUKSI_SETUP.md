# 📚 INSTRUKSI SETUP APLIKASI PERPUSTAKAAN

## ✅ LANGKAH DEMI LANGKAH

### 1. PERSIAPAN AWAL
- ✅ Pastikan **XAMPP** sudah terinstall dan berjalan
- ✅ Start **Apache** dan **MySQL** di XAMPP Control Panel
- ✅ Buka **phpMyAdmin** di `http://localhost:88/phpmyadmin/`
- ✅ Pastikan **Node.js** terinstall (cek dengan `node --version`)

### 2. SETUP DATABASE
```bash
# Buat database baru di phpMyAdmin
# Nama database: db_perpustakaan
```

**ATAU gunakan script otomatis:**
```bash
npm run setup-db
```

### 3. KONFIGURASI DATABASE
Edit file `backend/.env` sesuai setting MySQL Anda:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=db_perpustakaan
JWT_SECRET=perpustakaan_secret_key_2024
```

### 4. INSTALL DEPENDENCIES
```bash
# Install semua dependencies sekaligus
npm run install-all
```

### 5. JALANKAN APLIKASI
```bash
# Jalankan frontend dan backend bersamaan
npm run dev
```

**ATAU jalankan terpisah:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 6. AKSES APLIKASI
- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:5000
- 🗄️ **phpMyAdmin**: http://localhost:88/phpmyadmin/

---

## 👤 AKUN LOGIN DEFAULT

### 🔑 ADMIN
- **Username**: `admin`
- **Password**: `password`
- **Akses**: Dashboard Admin, Kelola Buku, Kelola Peminjaman, Kelola Kategori

### 👤 USER
- **Username**: `user1`  
- **Password**: `password`
- **Akses**: Dashboard User, Katalog Buku, Peminjaman

---

## 🎯 FITUR APLIKASI

### ✨ UNTUK USER:
- [x] **Registrasi & Login** - Daftar akun baru dan masuk
- [x] **Katalog Buku** - Lihat dan cari buku
- [x] **Peminjaman** - Pinjam buku dengan tanggal kembali
- [x] **Dashboard** - Pantau peminjaman aktif
- [x] **Pengembalian** - Kembalikan buku dengan catatan

### 🛠️ UNTUK ADMIN:
- [x] **Dashboard Admin** - Statistik dan overview
- [x] **Manajemen Buku** - Tambah, edit, hapus buku
- [x] **Manajemen Kategori** - Kelola kategori buku
- [x] **Manajemen Peminjaman** - Pantau semua peminjaman
- [x] **Sistem Denda** - Otomatis hitung denda keterlambatan

---

## 🔧 TROUBLESHOOTING

### ❌ Database Connection Error
```bash
# Pastikan MySQL berjalan
# Cek XAMPP Control Panel

# Cek konfigurasi database
# Edit backend/.env

# Test koneksi
npm run setup-db
```

### ❌ Port Already in Use
```bash
# Ganti port backend di backend/.env
PORT=5001

# Ganti port frontend di frontend/vite.config.js
server: { port: 3001 }
```

### ❌ Module Not Found
```bash
# Install ulang dependencies
npm run install-all

# Atau manual
cd backend && npm install
cd ../frontend && npm install
```

---

## 📊 STRUKTUR DATABASE

### 📋 TABEL UTAMA:
- **users** - Data pengguna (admin & user)
- **kategori** - Kategori buku  
- **buku** - Data buku lengkap
- **peminjaman** - Transaksi peminjaman
- **denda** - Data denda keterlambatan

### 🔗 RELASI:
- User → Peminjaman (1:N)
- Buku → Peminjaman (1:N)  
- Kategori → Buku (1:N)
- Peminjaman → Denda (1:1)

---

## 🚀 SELESAI!

Aplikasi perpustakaan sudah siap digunakan dengan:
- ✅ Frontend React + Vite
- ✅ Backend Express.js
- ✅ Database MySQL
- ✅ Sistem autentikasi JWT
- ✅ Role-based access (Admin/User)
- ✅ CRUD lengkap sesuai flowchart
- ✅ Sistem denda otomatis

**Happy Coding! 🎉**