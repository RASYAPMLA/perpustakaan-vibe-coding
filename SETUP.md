# 🚀 Setup Cepat Aplikasi Perpustakaan

## 📋 Langkah-langkah Setup

### 1. Persiapan
Pastikan sudah terinstall:
- **Node.js** (v16+)
- **MySQL** (melalui XAMPP/WAMP)
- **phpMyAdmin** di `http://localhost:88/phpmyadmin/`

### 2. Install Dependencies
```bash
npm run install-all
```

### 3. Setup Database
```bash
# Otomatis membuat database dan tabel
npm run setup-db
```

### 4. Konfigurasi Database (Jika Diperlukan)
Edit file `backend/.env` jika setting MySQL Anda berbeda:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=db_perpustakaan
```

### 5. Jalankan Aplikasi
```bash
npm run dev
```

### 6. Akses Aplikasi
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 👤 Login Default

### Admin
- Username: `admin`
- Password: `password`

### User
- Username: `user1`
- Password: `password`

## ✅ Selesai!
Aplikasi perpustakaan siap digunakan dengan fitur lengkap sesuai flowchart.

---

## 🔧 Troubleshooting

### Database Error?
1. Pastikan MySQL berjalan (start XAMPP)
2. Cek kredensial di `backend/.env`
3. Jalankan ulang `npm run setup-db`

### Port Conflict?
Edit port di:
- `backend/.env` → `PORT=5001`
- `frontend/vite.config.js` → `port: 3001`