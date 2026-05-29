import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Users, Clock, AlertTriangle, TrendingUp, Calendar, ArrowRight, ShieldCheck } from 'lucide-react'
import axios from 'axios'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalLoans: 0,
    activeLoans: 0,
    overdueLoans: 0,
    totalUnpaidFines: 0
  })
  const [recentLoans, setRecentLoans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, loansResponse] = await Promise.all([
        axios.get('/api/peminjaman/stats'),
        axios.get('/api/peminjaman')
      ])

      setStats(statsResponse.data)
      setRecentLoans(loansResponse.data.slice(0, 10))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      'dipinjam': 'bg-brand-500/10 text-brand-400 border-brand-500/25',
      'dikembalikan': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
      'terlambat': 'bg-rose-500/10 text-rose-400 border-rose-500/25'
    }
    return badges[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/25'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8 shadow-xl">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-500/10 rounded-full blur-2xl"></div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-brand-400 text-sm font-semibold">
              <ShieldCheck size={16} />
              <span className="uppercase tracking-widest text-xs">Konsol Pengelola Utama</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Dashboard Admin</h1>
            <p className="text-slate-400 max-w-xl">
              Pantau seluruh aktivitas perpustakaan digital secara langsung. Kelola koleksi buku, pantau pengembalian denda, dan verifikasi status peminjaman.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card border-l-4 border-l-brand-500 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-brand-500/5 rounded-full blur-xl group-hover:bg-brand-500/10 transition-colors"></div>
          <div className="flex items-center">
            <div className="p-3 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl">
              <BookOpen size={20} />
            </div>
            <div className="ml-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pinjam</p>
              <h3 className="text-2xl font-extrabold text-white mt-0.5">{stats.totalLoans}</h3>
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-l-emerald-500 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors"></div>
          <div className="flex items-center">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <Clock size={20} />
            </div>
            <div className="ml-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sedang Dipinjam</p>
              <h3 className="text-2xl font-extrabold text-white mt-0.5">{stats.activeLoans}</h3>
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-l-rose-500 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-colors"></div>
          <div className="flex items-center">
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
              <AlertTriangle size={20} />
            </div>
            <div className="ml-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Terlambat</p>
              <h3 className="text-2xl font-extrabold text-white mt-0.5">{stats.overdueLoans}</h3>
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-l-amber-500 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-colors"></div>
          <div className="flex items-center">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              <TrendingUp size={20} />
            </div>
            <div className="ml-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Denda Belum Bayar</p>
              <h3 className="text-lg font-extrabold text-white mt-0.5">
                Rp {stats.totalUnpaidFines.toLocaleString('id-ID')}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-extrabold text-white mb-6">Aksi Cepat Manajemen</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link 
            to="/admin/buku" 
            className="p-5 bg-slate-950/40 border border-slate-800 hover:border-brand-500/50 rounded-xl transition-all duration-300 group flex items-start space-x-4 cursor-pointer"
          >
            <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
              <BookOpen size={22} />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Kelola Buku</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Tambah baru, edit deskripsi buku, lokasi rak, atau hapus stok buku.</p>
            </div>
          </Link>

          <Link 
            to="/admin/peminjaman" 
            className="p-5 bg-slate-950/40 border border-slate-800 hover:border-emerald-500/50 rounded-xl transition-all duration-300 group flex items-start space-x-4 cursor-pointer"
          >
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
              <Clock size={22} />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Kelola Peminjaman</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Monitor pengembalian, status denda, dan verifikasi jatuh tempo.</p>
            </div>
          </Link>

          <Link 
            to="/admin/kategori" 
            className="p-5 bg-slate-950/40 border border-slate-800 hover:border-purple-500/50 rounded-xl transition-all duration-300 group flex items-start space-x-4 cursor-pointer"
          >
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
              <Users size={22} />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Kelola Kategori</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Kelola taksonomi kategori buku perpustakaan digital terintegrasi.</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Loans Grid Table */}
      {recentLoans.length > 0 && (
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-white">Log Peminjaman Terbaru</h2>
              <p className="text-slate-400 text-xs mt-1">Daftar anggota yang meminjam buku terakhir</p>
            </div>
            <Link 
              to="/admin/peminjaman" 
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center space-x-1 group"
            >
              <span>Lihat Semua Transaksi</span>
              <ArrowRight size={14} className="transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="overflow-x-auto border border-slate-800/80 rounded-xl bg-slate-950/20">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-900/60">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Peminjam
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Buku
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Tanggal Pinjam
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Batas Kembali
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 bg-transparent">
                {recentLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-bold text-slate-200">{loan.nama_lengkap}</div>
                        <div className="text-xs text-slate-500 mt-0.5">@{loan.username}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-200 max-w-xs truncate">{loan.judul}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{loan.pengarang}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {new Date(loan.tanggal_pinjam).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {new Date(loan.tanggal_kembali_rencana).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-0.5 text-xs font-bold border rounded-full ${getStatusBadge(loan.status)}`}>
                        {loan.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* System Analytics */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-white mb-4">Informasi Server</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
              <span className="text-slate-400">Versi Sistem:</span>
              <span className="font-semibold text-slate-200">1.0.0 (SaaS Pro)</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
              <span className="text-slate-400">Koneksi Database:</span>
              <span className="font-semibold text-emerald-400 flex items-center space-x-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block animate-ping"></span>
                <span>MySQL @3308 Laragon</span>
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400">Status Server:</span>
              <span className="font-semibold text-slate-200">Online & Stabil</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-white mb-4">Aktivitas Hari Ini</h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <div className="flex items-center space-x-2.5">
                <Calendar className="h-4 w-4 text-brand-400" />
                <span className="text-slate-400">Peminjaman Baru:</span>
              </div>
              <span className="font-bold text-slate-200">
                {recentLoans.filter(loan => 
                  new Date(loan.tanggal_pinjam).toDateString() === new Date().toDateString()
                ).length} Transaksi
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2.5">
                <Calendar className="h-4 w-4 text-emerald-400" />
                <span className="text-slate-400">Pengembalian Berhasil:</span>
              </div>
              <span className="font-bold text-slate-200">
                {recentLoans.filter(loan => 
                  loan.tanggal_kembali_aktual && 
                  new Date(loan.tanggal_kembali_aktual).toDateString() === new Date().toDateString()
                ).length} Buku
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard