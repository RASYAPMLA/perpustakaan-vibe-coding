import React, { useState, useEffect } from 'react'
import { BookOpen, Clock, CheckCircle, AlertTriangle, Calendar, User, Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import axios from 'axios'

const AdminPeminjaman = () => {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [returningLoan, setReturningLoan] = useState(null)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    try {
      const response = await axios.get('/api/peminjaman')
      setLoans(response.data)
    } catch (error) {
      console.error('Error fetching loans:', error)
      toast.error('Gagal memuat data peminjaman')
    } finally {
      setLoading(false)
    }
  }

  const handleReturn = async (loanId, data) => {
    setReturningLoan(loanId)
    try {
      const response = await axios.put(`/api/peminjaman/${loanId}/return`, data)
      
      if (response.status === 200) {
        toast.success('Buku berhasil dikembalikan!')
        if (response.data.fine > 0) {
          toast.error(`Denda: Rp ${response.data.fine.toLocaleString('id-ID')} (${response.data.daysOverdue} hari terlambat)`)
        }
        fetchLoans()
        reset()
      }
    } catch (error) {
      console.error('Error returning book:', error)
      toast.error(error.response?.data?.message || 'Gagal mengembalikan buku')
    } finally {
      setReturningLoan(null)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      'dipinjam': 'bg-blue-100 text-blue-800',
      'dikembalikan': 'bg-green-100 text-green-800',
      'terlambat': 'bg-red-100 text-red-800'
    }
    return badges[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'dipinjam':
        return <Clock className="h-4 w-4" />
      case 'dikembalikan':
        return <CheckCircle className="h-4 w-4" />
      case 'terlambat':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return null
    }
  }

  const isOverdue = (dueDate, status) => {
    if (status !== 'dipinjam') return false
    return new Date() > new Date(dueDate)
  }

  const getDaysUntilDue = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = searchTerm === '' || 
      loan.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.pengarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.username.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = (() => {
      switch (filter) {
        case 'active':
          return loan.status === 'dipinjam'
        case 'returned':
          return loan.status === 'dikembalikan'
        case 'overdue':
          return loan.status === 'terlambat' || isOverdue(loan.tanggal_kembali_rencana, loan.status)
        default:
          return true
      }
    })()

    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Kelola Peminjaman</h1>
        <p className="text-gray-600">Pantau dan kelola semua peminjaman buku</p>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari peminjam, buku, atau pengarang..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { key: 'all', label: 'Semua', count: loans.length },
            { key: 'active', label: 'Aktif', count: loans.filter(l => l.status === 'dipinjam').length },
            { key: 'overdue', label: 'Terlambat', count: loans.filter(l => l.status === 'terlambat' || isOverdue(l.tanggal_kembali_rencana, l.status)).length },
            { key: 'returned', label: 'Dikembalikan', count: loans.filter(l => l.status === 'dikembalikan').length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                filter === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Loans Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peminjam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Buku
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Pinjam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Kembali
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Denda
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLoans.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{loan.nama_lengkap}</div>
                        <div className="text-sm text-gray-500">@{loan.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-10 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {loan.judul}
                        </div>
                        <div className="text-sm text-gray-500">{loan.pengarang}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{new Date(loan.tanggal_pinjam).toLocaleDateString('id-ID')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(loan.tanggal_kembali_rencana).toLocaleDateString('id-ID')}
                    </div>
                    {loan.status === 'dipinjam' && (
                      <div className={`text-xs ${
                        isOverdue(loan.tanggal_kembali_rencana, loan.status)
                          ? 'text-red-600'
                          : getDaysUntilDue(loan.tanggal_kembali_rencana) <= 3
                          ? 'text-yellow-600'
                          : 'text-gray-500'
                      }`}>
                        {isOverdue(loan.tanggal_kembali_rencana, loan.status)
                          ? `Terlambat ${Math.abs(getDaysUntilDue(loan.tanggal_kembali_rencana))} hari`
                          : `${getDaysUntilDue(loan.tanggal_kembali_rencana)} hari lagi`
                        }
                      </div>
                    )}
                    {loan.tanggal_kembali_aktual && (
                      <div className="text-xs text-green-600">
                        Dikembalikan: {new Date(loan.tanggal_kembali_aktual).toLocaleDateString('id-ID')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(loan.status)}`}>
                      {getStatusIcon(loan.status)}
                      <span className="capitalize">{loan.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {loan.denda > 0 ? (
                      <span className="text-red-600 font-medium">
                        Rp {loan.denda.toLocaleString('id-ID')}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {loan.status === 'dipinjam' && (
                      <form onSubmit={handleSubmit((data) => handleReturn(loan.id, data))} className="space-y-2">
                        <textarea
                          {...register('catatan')}
                          placeholder="Catatan..."
                          className="input-field text-xs"
                          rows="2"
                        />
                        <button
                          type="submit"
                          disabled={returningLoan === loan.id}
                          className="w-full btn-primary text-xs py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {returningLoan === loan.id ? 'Proses...' : 'Kembalikan'}
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLoans.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Tidak Ada Hasil' : 'Tidak Ada Peminjaman'}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Coba ubah kata kunci pencarian.'
                : 'Belum ada peminjaman dalam kategori ini.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card bg-blue-50 border-blue-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900">{loans.length}</div>
            <div className="text-sm text-blue-600">Total Peminjaman</div>
          </div>
        </div>
        <div className="card bg-green-50 border-green-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-900">
              {loans.filter(l => l.status === 'dipinjam').length}
            </div>
            <div className="text-sm text-green-600">Sedang Dipinjam</div>
          </div>
        </div>
        <div className="card bg-red-50 border-red-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-900">
              {loans.filter(l => l.status === 'terlambat' || isOverdue(l.tanggal_kembali_rencana, l.status)).length}
            </div>
            <div className="text-sm text-red-600">Terlambat</div>
          </div>
        </div>
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-900">
              Rp {loans.reduce((total, loan) => total + (loan.denda || 0), 0).toLocaleString('id-ID')}
            </div>
            <div className="text-sm text-yellow-600">Total Denda</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPeminjaman