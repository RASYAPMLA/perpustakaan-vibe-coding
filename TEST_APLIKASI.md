# 🧪 TEST APLIKASI PERPUSTAKAAN

## ✅ CHECKLIST TESTING

### 1. TEST BACKEND
```bash
cd backend
npm run dev
```
**Expected Output:**
```
Server berjalan di port 5000
Health check: http://localhost:5000/api/health
```

### 2. TEST FRONTEND
```bash
cd frontend  
npm run dev
```
**Expected Output:**
```
Local:   http://localhost:3000/
Network: use --host to expose
```

### 3. TEST DATABASE CONNECTION
```bash
npm run setup-db
```
**Expected Output:**
```
✅ Connected to MySQL
✅ Database db_perpustakaan ready
✅ Tables created successfully
✅ Admin user created
✅ Regular user created
✅ Categories created
✅ Sample books created
🎉 Database setup completed successfully!
```

---

## 🔍 MANUAL TESTING

### 1. TEST LOGIN ADMIN
1. Buka http://localhost:3000/login
2. Username: `admin`, Password: `password`
3. Harus redirect ke `/admin` dashboard

### 2. TEST LOGIN USER
1. Buka http://localhost:3000/login  
2. Username: `user1`, Password: `password`
3. Harus redirect ke `/dashboard` user

### 3. TEST FITUR ADMIN
- ✅ Dashboard Admin - Lihat statistik
- ✅ Kelola Buku - CRUD buku
- ✅ Kelola Kategori - CRUD kategori  
- ✅ Kelola Peminjaman - Lihat semua peminjaman

### 4. TEST FITUR USER
- ✅ Katalog Buku - Lihat dan cari buku
- ✅ Detail Buku - Lihat detail dan pinjam
- ✅ Dashboard - Lihat peminjaman aktif
- ✅ Peminjaman Saya - Kelola peminjaman

### 5. TEST FLOW PEMINJAMAN
1. Login sebagai user
2. Buka katalog buku
3. Pilih buku yang tersedia
4. Klik "Lihat Detail & Pinjam"
5. Isi tanggal pengembalian
6. Klik "Pinjam Buku"
7. Cek di "Peminjaman Saya"

### 6. TEST FLOW PENGEMBALIAN
1. Di "Peminjaman Saya"
2. Pilih buku yang dipinjam
3. Isi catatan (opsional)
4. Klik "Kembalikan"
5. Status berubah menjadi "Dikembalikan"

---

## 🔧 API TESTING

### Test Health Check
```bash
curl http://localhost:5000/api/health
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

### Test Get Books
```bash
curl http://localhost:5000/api/buku
```

---

## 📊 EXPECTED RESULTS

### ✅ SUKSES JIKA:
- Backend server berjalan di port 5000
- Frontend berjalan di port 3000
- Database terhubung tanpa error
- Login admin dan user berhasil
- CRUD operations berfungsi
- Peminjaman dan pengembalian berjalan
- Sistem denda menghitung otomatis

### ❌ GAGAL JIKA:
- Connection refused errors
- Database connection failed
- Login tidak berhasil
- 404 errors pada API calls
- Frontend tidak load
- CRUD operations error

---

## 🎯 PERFORMANCE METRICS

### Response Time Target:
- **API Calls**: < 500ms
- **Page Load**: < 2s
- **Database Queries**: < 100ms

### Memory Usage:
- **Backend**: < 100MB
- **Frontend**: < 50MB

---

## 🚀 PRODUCTION READY

Aplikasi siap production jika semua test passed:
- [x] Authentication working
- [x] Authorization (Admin/User roles)
- [x] CRUD operations complete
- [x] Business logic implemented
- [x] Error handling proper
- [x] Security measures active
- [x] Database optimized
- [x] UI/UX responsive

**Status: ✅ READY FOR DEPLOYMENT**