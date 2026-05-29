import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { BookOpen, Calendar, MapPin, User, Building, Hash, ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import axios from 'axios'

const BukuDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [borrowing, setBorrowing] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      tanggal_kembali_rencana: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 14 days from now
    }
  })

  useEffect(() => {
    fetchBookDetail()
  }, [id])

  const fetchBookDetail = async () => {
    try {
      const response = await axios.get(`/api/buku/${id}`)
      setBook(response.data)
    } catch (error) {
      console.error('Error fetching book detail:', error)
      if (error.response?.status === 404) {
        toast.error('Buku tidak ditemukan')
        navigate('/buku')
      }
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu')
      navigate('/login')
      return
    }

    setBorrowing(true)
    try {
      const response = await axios.post('/api/peminjaman', {
        buku_id: parseInt(id),
        tanggal_kembali_rencana: data.tanggal_kembali_rencana
      })

      if (response.status === 201) {
        toast.success('Peminjaman berhasil dibuat!')
        navigate('/peminjaman')
      }
    } catch (error) {
      console.error('Error creating loan:', error)
      toast.error(error.response?.data?.message || 'Gagal membuat peminjaman')
    } finally {
      setBorrowing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Buku Tidak Ditemukan</h2>
        <button onClick={() => navigate('/buku')} className="btn-primary">
          Kembali ke Katalog
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/buku')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Kembali ke Katalog</span>
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Book Cover and Basic Info */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center mb-6">
              {book.cover_url ? (
                <img 
                  src={book.cover_url} 
                  alt={book.judul}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <BookOpen className="h-20 w-20 text-gray-400" />
              )}
            </div>

            <div className="space-y-4">
              <div className={`text-center p-3 rounded-lg ${
                book.jumlah_tersedia > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <p className="font-semibold">
                  {book.jumlah_tersedia > 0 
                    ? `Tersedia: ${book.jumlah_tersedia} dari ${book.jumlah_total}` 
                    : 'Tidak Tersedia'
                  }
                </p>
              </div>

              {book.nama_kategori && (
                <div className="text-center">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {book.nama_kategori}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Book Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Author */}
          <div className="card">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.judul}</h1>
            <div className="flex items-center space-x-2 text-gray-600 mb-4">
              <User className="h-5 w-5" />
              <span className="text-lg">{book.pengarang}</span>
            </div>

            {book.deskripsi && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{book.deskripsi}</p>
              </div>
            )}
          </div>

          {/* Book Information */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Informasi Buku</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {book.penerbit && (
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Penerbit</p>
                    <p className="font-medium">{book.penerbit}</p>
                  </div>
                </div>
              )}

              {book.tahun_terbit && (
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Tahun Terbit</p>
                    <p className="font-medium">{book.tahun_terbit}</p>
                  </div>
                </div>
              )}

              {book.isbn && (
                <div className="flex items-center space-x-3">
                  <Hash className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">ISBN</p>
                    <p className="font-medium">{book.isbn}</p>
                  </div>
                </div>
              )}

              {book.lokasi_rak && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Lokasi Rak</p>
                    <p className="font-medium">{book.lokasi_rak}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Borrow Form */}
          {book.jumlah_tersedia > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Pinjam Buku</h2>
              
              {isAuthenticated ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label htmlFor="tanggal_kembali_rencana" className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Rencana Pengembalian
                    </label>
                    <input
                      {...register('tanggal_kembali_rencana', { 
                        required: 'Tanggal pengembalian diperlukan',
                        validate: value => {
                          const selectedDate = new Date(value)
                          const today = new Date()
                          const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
                          
                          if (selectedDate <= today) {
                            return 'Tanggal pengembalian harus setelah hari ini'
                          }
                          if (selectedDate > maxDate) {
                            return 'Maksimal peminjaman 30 hari'
                          }
                          return true
                        }
                      })}
                      type="date"
                      className="input-field"
                      min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    />
                    {errors.tanggal_kembali_rencana && (
                      <p className="mt-1 text-sm text-red-600">{errors.tanggal_kembali_rencana.message}</p>
                    )}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">Ketentuan Peminjaman:</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Maksimal peminjaman 30 hari</li>
                      <li>• Denda Rp 1.000 per hari untuk keterlambatan</li>
                      <li>• Buku harus dikembalikan dalam kondisi baik</li>
                      <li>• Tidak dapat meminjam buku lain jika ada denda yang belum dibayar</li>
                    </ul>
                  </div>

                  <button
                    type="submit"
                    disabled={borrowing}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {borrowing ? 'Memproses...' : 'Pinjam Buku'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">Silakan login untuk meminjam buku</p>
                  <button
                    onClick={() => navigate('/login')}
                    className="btn-primary"
                  >
                    Login Sekarang
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Not Available Message */}
          {book.jumlah_tersedia === 0 && (
            <div className="card bg-red-50 border-red-200">
              <div className="text-center py-6">
                <h3 className="text-lg font-medium text-red-900 mb-2">Buku Tidak Tersedia</h3>
                <p className="text-red-700">
                  Semua eksemplar buku ini sedang dipinjam. Silakan coba lagi nanti.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BukuDetail