-- Setup Database untuk Aplikasi Perpustakaan
-- Jalankan script ini di phpMyAdmin

USE db_perpustakaan;

-- Tabel Users (Admin dan User)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    nama_lengkap VARCHAR(100) NOT NULL,
    alamat TEXT,
    telepon VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Kategori Buku
CREATE TABLE IF NOT EXISTS kategori (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Buku
CREATE TABLE IF NOT EXISTS buku (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(200) NOT NULL,
    pengarang VARCHAR(100) NOT NULL,
    penerbit VARCHAR(100),
    tahun_terbit YEAR,
    isbn VARCHAR(20) UNIQUE,
    kategori_id INT,
    jumlah_total INT DEFAULT 1,
    jumlah_tersedia INT DEFAULT 1,
    lokasi_rak VARCHAR(50),
    deskripsi TEXT,
    cover_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (kategori_id) REFERENCES kategori(id) ON DELETE SET NULL
);

-- Tabel Peminjaman
CREATE TABLE IF NOT EXISTS peminjaman (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    buku_id INT NOT NULL,
    tanggal_pinjam DATE NOT NULL,
    tanggal_kembali_rencana DATE NOT NULL,
    tanggal_kembali_aktual DATE NULL,
    status ENUM('dipinjam', 'dikembalikan', 'terlambat') DEFAULT 'dipinjam',
    denda DECIMAL(10,2) DEFAULT 0,
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (buku_id) REFERENCES buku(id) ON DELETE CASCADE
);

-- Tabel Denda
CREATE TABLE IF NOT EXISTS denda (
    id INT AUTO_INCREMENT PRIMARY KEY,
    peminjaman_id INT NOT NULL,
    jumlah_denda DECIMAL(10,2) NOT NULL,
    status_bayar ENUM('belum_bayar', 'sudah_bayar') DEFAULT 'belum_bayar',
    tanggal_bayar DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (peminjaman_id) REFERENCES peminjaman(id) ON DELETE CASCADE
);

-- Insert data default
-- Admin default
INSERT INTO users (username, email, password, role, nama_lengkap, alamat, telepon) VALUES
('admin', 'admin@perpustakaan.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Administrator', 'Jl. Perpustakaan No. 1', '081234567890');

-- User default
INSERT INTO users (username, email, password, role, nama_lengkap, alamat, telepon) VALUES
('user1', 'user1@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'User Satu', 'Jl. User No. 1', '081234567891');

-- Kategori default
INSERT INTO kategori (nama_kategori, deskripsi) VALUES
('Fiksi', 'Buku-buku fiksi dan novel'),
('Non-Fiksi', 'Buku-buku non-fiksi dan referensi'),
('Teknologi', 'Buku-buku tentang teknologi dan komputer'),
('Sejarah', 'Buku-buku sejarah'),
('Sains', 'Buku-buku sains dan penelitian');

-- Buku contoh
INSERT INTO buku (judul, pengarang, penerbit, tahun_terbit, isbn, kategori_id, jumlah_total, jumlah_tersedia, lokasi_rak) VALUES
('Laskar Pelangi', 'Andrea Hirata', 'Bentang Pustaka', 2005, '9789793062792', 1, 3, 3, 'A-001'),
('Bumi Manusia', 'Pramoedya Ananta Toer', 'Hasta Mitra', 1980, '9789799731234', 1, 2, 2, 'A-002'),
('Clean Code', 'Robert C. Martin', 'Prentice Hall', 2008, '9780132350884', 3, 1, 1, 'B-001'),
('Sejarah Indonesia', 'M.C. Ricklefs', 'Serambi', 2005, '9789792202234', 4, 2, 2, 'C-001');