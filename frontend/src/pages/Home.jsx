import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { BookOpen, Sparkles, Shield, BookmarkCheck, Search, ChevronRight } from 'lucide-react'
import axios from 'axios'

const Home = () => {
  const { isAuthenticated } = useAuth()
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    totalCategories: 0
  })
  const [recentBooks, setRecentBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [booksResponse, categoriesResponse] = await Promise.all([
        axios.get('/api/buku'),
        axios.get('/api/kategori')
      ])
      
      const books = booksResponse.data
      setRecentBooks(books.slice(0, 6))

      const total = books.length
      const available = books.reduce((acc, curr) => acc + (curr.jumlah_tersedia > 0 ? 1 : 0), 0)
      
      setStats({
        totalBooks: total,
        availableBooks: available,
        totalCategories: categoriesResponse.data.length
      })
    } catch (error) {
      console.error('Error fetching home page data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-20 pb-16 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950 px-8 py-20 md:py-28 text-center shadow-2xl">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25"></div>
        
        {/* Ambient Glows */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-brand-500/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
            <Sparkles size={14} className="text-brand-400 animate-pulse" />
            <span>Sistem Informasi Perpustakaan Digital Terintegrasi</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-none text-white">
            Kelola & Jelajahi Ilmu Di <br />
            <span className="gradient-text">Era Digital Modern</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Akses ribuan buku berkualitas tinggi, kelola peminjaman secara mandiri, dan pantau pengembalian dengan sistem pintar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link 
              to="/buku" 
              className="btn-primary flex items-center justify-center space-x-2 text-base px-8 py-3.5"
            >
              <Search size={18} />
              <span>Jelajahi Katalog Buku</span>
            </Link>
            {!isAuthenticated && (
              <Link 
                to="/register" 
                className="btn-secondary flex items-center justify-center space-x-2 text-base px-8 py-3.5 hover:bg-slate-800 hover:text-white"
              >
                <span>Daftar Akun Baru</span>
                <ChevronRight size={18} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Statistics Grid */}
      <section className="grid sm:grid-cols-3 gap-6">
        <div className="card text-center flex flex-col justify-between py-8 border border-slate-800/40 hover:border-slate-700/60 shadow-lg relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl group-hover:bg-brand-500/10 transition-colors duration-500"></div>
          <div>
            <p className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-1">Total Koleksi Buku</p>
            <h3 className="text-4xl font-extrabold text-white mb-2">{stats.totalBooks}</h3>
          </div>
          <p className="text-sm text-slate-400">Judul buku terdaftar dalam sistem perpustakaan</p>
        </div>

        <div className="card text-center flex flex-col justify-between py-8 border border-slate-800/40 hover:border-slate-700/60 shadow-lg relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors duration-500"></div>
          <div>
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Buku Tersedia</p>
            <h3 className="text-4xl font-extrabold text-white mb-2">{stats.availableBooks}</h3>
          </div>
          <p className="text-sm text-slate-400">Buku siap dipinjam saat ini tanpa antrean</p>
        </div>

        <div className="card text-center flex flex-col justify-between py-8 border border-slate-800/40 hover:border-slate-700/60 shadow-lg relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors duration-500"></div>
          <div>
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Kategori Pilihan</p>
            <h3 className="text-4xl font-extrabold text-white mb-2">{stats.totalCategories}</h3>
          </div>
          <p className="text-sm text-slate-400">Kategori bidang keilmuan yang terstruktur</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Mengapa Memilih Layanan Kami?</h2>
          <p className="text-slate-400">Nikmati efisiensi manajemen peminjaman buku digital dengan berbagai fitur unggulan</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card space-y-4 hover:-translate-y-1 transition-all duration-300 group">
            <div className="p-3 bg-brand-500/10 border border-brand-500/20 w-12 h-12 rounded-xl flex items-center justify-center text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Katalog Digital Terpadu</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Cari buku dari ratusan penulis terkenal di dunia secara instan dengan pencarian pintar berdasar kategori dan pengarang.
            </p>
          </div>

          <div className="card space-y-4 hover:-translate-y-1 transition-all duration-300 group">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 w-12 h-12 rounded-xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
              <BookmarkCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Peminjaman Mandiri</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Ajukan permintaan peminjaman langsung dari gadget Anda. Pengisian form peminjaman yang simpel dan aman terkendali.
            </p>
          </div>

          <div className="card space-y-4 hover:-translate-y-1 transition-all duration-300 group">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 w-12 h-12 rounded-xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Sistem Keamanan JWT</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Perlindungan data akun, enkripsi password mutakhir, serta otorisasi aman (Role-based JWT) untuk kenyamanan penuh.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Books Section */}
      {recentBooks.length > 0 && (
        <section className="space-y-8">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">Koleksi Terbaru</h2>
              <p className="text-slate-400 text-sm">Daftar buku-buku teranyar yang baru saja masuk ke rak perpustakaan</p>
            </div>
            <Link 
              to="/buku" 
              className="text-brand-400 hover:text-brand-300 font-semibold text-sm flex items-center space-x-1 group"
            >
              <span>Lihat Semua Katalog</span>
              <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentBooks.map((book) => (
              <div key={book.id} className="card flex flex-col justify-between hover:border-slate-700 hover:shadow-2xl transition-all duration-300 overflow-hidden relative group">
                <div className="flex space-x-4">
                  <div className="w-20 h-28 bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-700/50 group-hover:border-slate-600 transition-colors">
                    {book.cover_url ? (
                      <img 
                        src={book.cover_url} 
                        alt={book.judul} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <BookOpen className="h-10 w-10 text-slate-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-400 mb-1 block">
                      {book.nama_kategori || 'Umum'}
                    </span>
                    <h3 className="font-bold text-white text-lg line-clamp-2 leading-snug group-hover:text-brand-300 transition-colors mb-1">
                      {book.judul}
                    </h3>
                    <p className="text-slate-400 text-sm mb-2">{book.pengarang}</p>
                    <div className="inline-flex text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full">
                      Tersedia: {book.jumlah_tersedia}
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/80">
                  <Link 
                    to={`/buku/${book.id}`}
                    className="w-full btn-primary text-center block text-sm py-2"
                  >
                    Detail & Pinjam
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 p-8 md:p-12 text-center shadow-xl">
          <div className="absolute -bottom-40 left-0 w-80 h-80 bg-brand-500/5 rounded-full blur-[100px]"></div>
          <div className="relative max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-tight">Mulai Perjalanan Literasi Anda Hari Ini</h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Bergabunglah secara gratis, jelajahi ribuan literatur referensi keilmuan, dan nikmati kemudahan sistem peminjaman modern.
            </p>
            <div className="pt-2">
              <Link to="/register" className="btn-primary px-8 py-3 text-base">
                Daftar Akun Gratis Sekarang
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home