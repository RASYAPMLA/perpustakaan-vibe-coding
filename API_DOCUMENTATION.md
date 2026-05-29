# 📚 API DOCUMENTATION - SISTEM PERPUSTAKAAN

## 🔗 Base URL
```
http://localhost:5000/api
```

## 🔐 Authentication
Gunakan JWT Token di header:
```
Authorization: Bearer <token>
```

---

## 🔑 AUTHENTICATION ENDPOINTS

### POST /auth/register
Registrasi user baru
```json
{
  "username": "string",
  "email": "string", 
  "password": "string",
  "nama_lengkap": "string",
  "alamat": "string (optional)",
  "telepon": "string (optional)"
}
```

### POST /auth/login
Login user
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@perpustakaan.com",
    "role": "admin",
    "nama_lengkap": "Administrator"
  }
}
```

### GET /auth/me
Get current user info (requires auth)

---

## 📖 BUKU ENDPOINTS

### GET /buku
Get all books
**Query Parameters:**
- `search` - Search by title or author
- `kategori` - Filter by category ID

### GET /buku/:id
Get book by ID

### POST /buku (Admin only)
Add new book
```json
{
  "judul": "string",
  "pengarang": "string",
  "penerbit": "string (optional)",
  "tahun_terbit": "number (optional)",
  "isbn": "string (optional)",
  "kategori_id": "number (optional)",
  "jumlah_total": "number",
  "lokasi_rak": "string (optional)",
  "deskripsi": "string (optional)",
  "cover_url": "string (optional)"
}
```

### PUT /buku/:id (Admin only)
Update book

### DELETE /buku/:id (Admin only)
Delete book

---

## 📋 KATEGORI ENDPOINTS

### GET /kategori
Get all categories

### POST /kategori (Admin only)
Add new category
```json
{
  "nama_kategori": "string",
  "deskripsi": "string (optional)"
}
```

### PUT /kategori/:id (Admin only)
Update category

### DELETE /kategori/:id (Admin only)
Delete category

---

## 📚 PEMINJAMAN ENDPOINTS

### GET /peminjaman
Get loans
- **Admin**: All loans
- **User**: Own loans only

### POST /peminjaman
Create new loan
```json
{
  "buku_id": "number",
  "tanggal_kembali_rencana": "date (YYYY-MM-DD)"
}
```

### PUT /peminjaman/:id/return
Return book
```json
{
  "catatan": "string (optional)"
}
```

### GET /peminjaman/stats (Admin only)
Get loan statistics
```json
{
  "totalLoans": 10,
  "activeLoans": 5,
  "overdueLoans": 2,
  "totalUnpaidFines": 15000
}
```

---

## 📊 RESPONSE FORMATS

### Success Response
```json
{
  "message": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "message": "Error message",
  "errors": [
    {
      "field": "field_name",
      "message": "Validation error"
    }
  ]
}
```

---

## 🔒 HTTP STATUS CODES

- **200** - OK
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **500** - Internal Server Error

---

## 🧪 EXAMPLE REQUESTS

### Login Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password"
  }'
```

### Get Books with Search
```bash
curl "http://localhost:5000/api/buku?search=laskar&kategori=1"
```

### Create Loan
```bash
curl -X POST http://localhost:5000/api/peminjaman \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "buku_id": 1,
    "tanggal_kembali_rencana": "2024-02-15"
  }'
```

### Return Book
```bash
curl -X PUT http://localhost:5000/api/peminjaman/1/return \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "catatan": "Buku dalam kondisi baik"
  }'
```

---

## 🔄 BUSINESS LOGIC

### Peminjaman Rules:
1. User harus login
2. Buku harus tersedia (jumlah_tersedia > 0)
3. User tidak boleh punya denda yang belum dibayar
4. User tidak boleh meminjam buku yang sama 2x
5. Maksimal peminjaman 30 hari

### Pengembalian Rules:
1. Hanya buku dengan status "dipinjam" yang bisa dikembalikan
2. Denda Rp 1.000/hari untuk keterlambatan
3. Status otomatis berubah ke "terlambat" jika lewat due date
4. Stok buku otomatis bertambah setelah dikembalikan

### Denda System:
- Denda = (Hari Terlambat) × Rp 1.000
- Status: "belum_bayar" / "sudah_bayar"
- User tidak bisa pinjam buku baru jika ada denda belum bayar

---

## 🛡️ SECURITY FEATURES

- **JWT Authentication** - Token-based auth
- **Password Hashing** - bcryptjs
- **Input Validation** - express-validator
- **SQL Injection Protection** - Prepared statements
- **CORS Configuration** - Cross-origin protection
- **Role-based Access** - Admin/User permissions

---

## 📈 PERFORMANCE

- **Connection Pooling** - MySQL connection pool
- **Async/Await** - Non-blocking operations
- **Error Handling** - Proper error responses
- **Validation** - Input sanitization

**API Ready for Production! 🚀**