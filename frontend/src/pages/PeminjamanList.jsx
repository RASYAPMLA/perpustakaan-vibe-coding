import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Clock, CheckCircle, AlertTriangle, Calendar } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import axios from 'axios'

const PeminjamanList = () => {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [returningLoan, setReturningLoan] = useState(null)
  const [filter, setFilter] = useState('all')

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Peminjaman Saya</h1>
          <p className="text-gray-600">Kelola dan pantau peminjaman buku Anda</p>
        </div>
        <Link to="/buku" className="btn-primary">
          Pinjam Buku Baru
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="card">
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

      {/* Loans List */}
      {filteredLoans.length > 0 ? (
        <div className="space-y-4">
          {filteredLoans.map((loan) => (
            <div key={loan.id} className="card">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Book Info */}
                <div className="flex space-x-4">
                  <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1">{loan.judul}</h3>
                    <p className="text-gray-600 text-sm mb-2">{loan.pengarang}</p>
                    
                    <div className="flex flex-wrap gap-2 text-sm">
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(loan.status)}`}>
                        {getStatusIcon(loan.status)}
                        <span className="capitalize">{loan.status}</span>
                      </div>
                      
                      {loan.status === 'dipinjam' && (
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isOverdue(loan.tanggal_kembali_rencana, loan.status)
                            ? 'bg-red-100 text-red-800'
                            : getDaysUntilDue(loan.tanggal_kembali_rencana) <= 3
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {isOverdue(loan.tanggal_kembali_rencana, loan.status)
                            ? `Terlambat ${Math.abs(getDaysUntilDue(loan.tanggal_kembali_rencana))} hari`
                            : `${getDaysUntilDue(loan.tanggal_kembali_rencana)} hari lagi`
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dates and Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Dipinjam: {new Date(loan.tanggal_pinjam).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Kembali: {new Date(loan.tanggal_kembali_rencana).toLocaleDateString('id-ID')}</span>
                    </div>
                    {loan.tanggal_kembali_aktual && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Dikembalikan: {new Date(loan.tanggal_kembali_aktual).toLocaleDateString('id-ID')}</span>
                      </div>
                    )}
                    {loan.denda > 0 && (
                      <div className="text-red-600 font-medium">
                        Denda: Rp {loan.denda.toLocaleString('id-ID')}
                      </div>
                    )}
                  </div>

                  {/* Return Button */}
                  {loan.status === 'dipinjam' && (
                    <div className="flex-shrink-0">
                      <form onSubmit={handleSubmit((data) => handleReturn(loan.id, data))}>
                        <div className="space-y-2">
                          <textarea
                            {...register('catatan')}
                            placeholder="Catatan (opsional)"
                            className="input-field text-sm"
                            rows="2"
                          />
                          <button
                            type="submit"
                            disabled={returningLoan === loan.id}
                            className="w-full btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {returningLoan === loan.id ? 'Memproses...' : 'Kembalikan'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {loan.catatan && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Catatan:</span> {loan.catatan}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'Belum Ada Peminjaman' : `Tidak Ada Peminjaman ${
              filter === 'active' ? 'Aktif' :
              filter === 'overdue' ? 'Terlambat' :
              filter === 'returned' ? 'yang Dikembalikan' : ''
            }`}
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? 'Mulai jelajahi katalog buku dan lakukan peminjaman pertama Anda.'
              : 'Tidak ada peminjaman dalam kategori ini.'
            }
          </p>
          {filter === 'all' && (
            <Link to="/buku" className="btn-primary">
              Jelajahi Katalog
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default PeminjamanList