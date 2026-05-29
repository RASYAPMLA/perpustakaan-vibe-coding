import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { BookOpen, Clock, AlertTriangle, CheckCircle, Search, ArrowRight, User } from 'lucide-react'
import axios from 'axios'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    activeLoans: 0,
    overdueLoans: 0,
    totalLoans: 0
  })
  const [recentLoans, setRecentLoans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/peminjaman')
      const loans = response.data

      // Calculate stats
      const activeLoans = loans.filter(loan => loan.status === 'dipinjam').length
      const overdueLoans = loans.filter(loan => loan.status === 'terlambat').length
      const totalLoans = loans.length

      setStats({ activeLoans, overdueLoans, totalLoans })
      setRecentLoans(loans.slice(0, 5))
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'dipinjam':
        return <Clock className="h-3.5 w-3.5" />
      case 'dikembalikan':
        return <CheckCircle className="h-3.5 w-3.5" />
      case 'terlambat':
        return <AlertTriangle className="h-3.5 w-3.5" />
      default:
        return null
    }
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
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8 shadow-xl">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-500/10 rounded-full blur-2xl"></div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-brand-400 text-sm font-semibold">
              <User size={16} />
              <span className="uppercase tracking-widest text-xs">Informasi Profil Anggota</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              Selamat Datang Kembali, {user?.nama_lengkap}!
            </h1>
            <p className="text-slate-400 max-w-xl">
              Cek riwayat peminjaman buku aktif Anda, pantau tanggal jatuh tempo untuk menghindari denda, atau cari buku baru untuk dibaca hari ini.
            </p>
          </div>
          <Link 
            to="/buku" 
            className="btn-primary self-start md:self-center flex items-center space-x-2"
          >
            <Search size={16} />
            <span>Cari Buku Baru</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="card border-l-4 border-l-brand-500 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-brand-500/5 rounded-full blur-xl group-hover:bg-brand-500/10 transition-colors"></div>
          <div className="flex items-center">
            <div className="p-3 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl">
              <BookOpen size={22} />
            </div>
            <div className="ml-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sedang Dipinjam</p>
              <h3 className="text-3xl font-extrabold text-white mt-0.5">{stats.activeLoans}</h3>
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-l-rose-500 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-colors"></div>
          <div className="flex items-center">
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
              <AlertTriangle size={22} />
            </div>
            <div className="ml-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Terlambat Kembali</p>
              <h3 className="text-3xl font-extrabold text-white mt-0.5">{stats.overdueLoans}</h3>
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-l-emerald-500 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors"></div>
          <div className="flex items-center">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <CheckCircle size={22} />
            </div>
            <div className="ml-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Peminjaman</p>
              <h3 className="text-3xl font-extrabold text-white mt-0.5">{stats.totalLoans}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Loans */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-white">Aktivitas Peminjaman Terbaru</h2>
                <p className="text-slate-400 text-xs mt-1">Daftar transaksi peminjaman buku terakhir Anda</p>
              </div>
              {recentLoans.length > 0 && (
                <Link 
                  to="/peminjaman" 
                  className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center space-x-1 group"
                >
                  <span>Lihat Semua</span>
                  <ArrowRight size={14} className="transform group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}
            </div>

            {recentLoans.length > 0 ? (
              <div className="space-y-4">
                {recentLoans.map((loan) => (
                  <div key={loan.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-950/40 border border-slate-800/80 rounded-xl hover:border-slate-700/60 transition-colors gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-16 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-6 w-6 text-brand-400" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-white text-sm line-clamp-1">{loan.judul}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{loan.pengarang}</p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Dipinjam: {new Date(loan.tanggal_pinjam).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-slate-800/80 pt-2 sm:pt-0">
                      <div className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(loan.status)}`}>
                        {getStatusIcon(loan.status)}
                        <span className="capitalize">{loan.status}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 sm:mt-2">
                        Batas Kembali: <span className="font-semibold text-slate-300">{new Date(loan.tanggal_kembali_rencana).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl">
                <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-white">Belum Ada Transaksi</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">Anda belum pernah melakukan peminjaman buku apa pun.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Help & Rules */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card bg-brand-950/20 border-brand-500/25">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <CheckCircle size={18} className="text-brand-400" />
              <span>Ketentuan & Aturan</span>
            </h3>
            <ul className="space-y-4 text-xs text-slate-300">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-brand-400 rounded-full mt-1.5 mr-2.5 flex-shrink-0"></span>
                <span><strong>Batas Waktu:</strong> Masa peminjaman maksimal adalah 30 hari sejak tanggal pengajuan disetujui.</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-brand-400 rounded-full mt-1.5 mr-2.5 flex-shrink-0"></span>
                <span><strong>Denda Keterlambatan:</strong> Terlambat mengembalikan buku dikenakan denda sebesar <strong>Rp 1.000 / hari</strong>.</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-brand-400 rounded-full mt-1.5 mr-2.5 flex-shrink-0"></span>
                <span><strong>Kondisi Koleksi:</strong> Buku wajib dijaga kebersihan & keutuhannya agar terhindar dari ganti rugi fisik.</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-brand-400 rounded-full mt-1.5 mr-2.5 flex-shrink-0"></span>
                <span><strong>Pembayaran Denda:</strong> Segera selesaikan denda yang tertunggak untuk membuka akses peminjaman buku berikutnya.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard