const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './backend/.env' });

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔄 Connecting to MySQL...');
    
    // Try different connection options
    const connectionOptions = [
      {
        host: '127.0.0.1',
        port: parseInt(process.env.DB_PORT) || 3308,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || ''
      },
      {
        host: '127.0.0.1',
        port: 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || ''
      },
      {
        host: 'localhost',
        port: 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || ''
      },
      {
        host: '127.0.0.1',
        port: 3307,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || ''
      }
    ];

    let connected = false;
    for (const options of connectionOptions) {
      try {
        console.log(`Trying connection to ${options.host}:${options.port}...`);
        connection = await mysql.createConnection(options);
        console.log(`✅ Connected to MySQL at ${options.host}:${options.port}`);
        connected = true;
        break;
      } catch (err) {
        console.log(`❌ Failed to connect to ${options.host}:${options.port}: ${err.message}`);
      }
    }

    if (!connected) {
      throw new Error('Could not connect to MySQL. Please ensure MySQL is running.');
    }

    // Create database if not exists
    console.log('🔄 Creating database...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.query(`USE ${process.env.DB_NAME}`);
    console.log(`✅ Database ${process.env.DB_NAME} ready`);

    // Create tables
    console.log('🔄 Creating tables...');

    // Users table
    await connection.execute(`
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
      )
    `);

    // Categories table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS kategori (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_kategori VARCHAR(100) NOT NULL,
        deskripsi TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Books table
    await connection.execute(`
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
      )
    `);

    // Loans table
    await connection.execute(`
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
      )
    `);

    // Fines table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS denda (
        id INT AUTO_INCREMENT PRIMARY KEY,
        peminjaman_id INT NOT NULL,
        jumlah_denda DECIMAL(10,2) NOT NULL,
        status_bayar ENUM('belum_bayar', 'sudah_bayar') DEFAULT 'belum_bayar',
        tanggal_bayar DATE NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (peminjaman_id) REFERENCES peminjaman(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Tables created successfully');

    // Insert default data
    console.log('🔄 Inserting default data...');

    // Hash passwords
    const hashedPassword = await bcrypt.hash('password', 10);

    // Check if admin exists
    const [adminExists] = await connection.execute('SELECT id FROM users WHERE username = ?', ['admin']);
    
    if (adminExists.length === 0) {
      // Insert admin user
      await connection.execute(`
        INSERT INTO users (username, email, password, role, nama_lengkap, alamat, telepon) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, ['admin', 'admin@perpustakaan.com', hashedPassword, 'admin', 'Administrator', 'Jl. Perpustakaan No. 1', '081234567890']);
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // Check if user1 exists
    const [userExists] = await connection.execute('SELECT id FROM users WHERE username = ?', ['user1']);
    
    if (userExists.length === 0) {
      // Insert regular user
      await connection.execute(`
        INSERT INTO users (username, email, password, role, nama_lengkap, alamat, telepon) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, ['user1', 'user1@email.com', hashedPassword, 'user', 'User Satu', 'Jl. User No. 1', '081234567891']);
      console.log('✅ Regular user created');
    } else {
      console.log('ℹ️ Regular user already exists');
    }

    // Insert categories
    const categories = [
      ['Fiksi', 'Buku-buku fiksi dan novel'],
      ['Non-Fiksi', 'Buku-buku non-fiksi dan referensi'],
      ['Teknologi', 'Buku-buku tentang teknologi dan komputer'],
      ['Sejarah', 'Buku-buku sejarah'],
      ['Sains', 'Buku-buku sains dan penelitian']
    ];

    for (const [nama, deskripsi] of categories) {
      const [categoryExists] = await connection.execute('SELECT id FROM kategori WHERE nama_kategori = ?', [nama]);
      if (categoryExists.length === 0) {
        await connection.execute('INSERT INTO kategori (nama_kategori, deskripsi) VALUES (?, ?)', [nama, deskripsi]);
      }
    }
    console.log('✅ Categories created');

    // Insert sample books
    const books = [
      ['Laskar Pelangi', 'Andrea Hirata', 'Bentang Pustaka', 2005, '9789793062792', 1, 3, 3, 'A-001'],
      ['Bumi Manusia', 'Pramoedya Ananta Toer', 'Hasta Mitra', 1980, '9789799731234', 1, 2, 2, 'A-002'],
      ['Clean Code', 'Robert C. Martin', 'Prentice Hall', 2008, '9780132350884', 3, 1, 1, 'B-001'],
      ['Sejarah Indonesia', 'M.C. Ricklefs', 'Serambi', 2005, '9789792202234', 4, 2, 2, 'C-001']
    ];

    for (const [judul, pengarang, penerbit, tahun, isbn, kategori_id, jumlah_total, jumlah_tersedia, lokasi_rak] of books) {
      const [bookExists] = await connection.execute('SELECT id FROM buku WHERE isbn = ?', [isbn]);
      if (bookExists.length === 0) {
        await connection.execute(`
          INSERT INTO buku (judul, pengarang, penerbit, tahun_terbit, isbn, kategori_id, jumlah_total, jumlah_tersedia, lokasi_rak) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [judul, pengarang, penerbit, tahun, isbn, kategori_id, jumlah_total, jumlah_tersedia, lokasi_rak]);
      }
    }
    console.log('✅ Sample books created');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Default Accounts:');
    console.log('👤 Admin - Username: admin, Password: password');
    console.log('👤 User  - Username: user1, Password: password');
    console.log('\n🚀 You can now start the application with: npm run dev');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MySQL is running (start XAMPP/WAMP)');
    console.log('2. Check if MySQL is running on port 3306 or 3307');
    console.log('3. Verify MySQL credentials in backend/.env');
    console.log('4. Try accessing phpMyAdmin to confirm MySQL is working');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run setup
setupDatabase();