import React, { useState, useEffect } from 'react'
import { BookOpen, Plus, Edit, Trash2, Search, Filter } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import axios from 'axios'

const AdminBuku = () => {
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()

  useEffect(() => {
    fetchBooks()
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchBooks()
  }, [searchTerm, selectedCategory])

  const fetchBooks = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory) params.append('kategori', selectedCategory)

      const response = await axios.get(`/api/buku?${params}`)
      setBooks(response.data)
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/kategori')
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleAddBook = () => {
    setEditingBook(null)
    reset()
    setShowModal(true)
  }

  const handleEditBook = (book) => {
    setEditingBook(book)
    setValue('judul', book.judul)
    setValue('pengarang', book.pengarang)
    setValue('penerbit', book.penerbit || '')
    setValue('tahun_terbit', book.tahun_terbit || '')
    setValue('isbn', book.isbn || '')
    setValue('kategori_id', book.kategori_id || '')
    setValue('jumlah_total', book.jumlah_total)
    setValue('lokasi_rak', book.lokasi_rak || '')
    setValue('deskripsi', book.deskripsi || '')
    setValue('cover_url', book.cover_url || '')
    setShowModal(true)
  }

  const handleDeleteBook = async (bookId, bookTitle) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus buku "${bookTitle}"?`)) {
      try {
        await axios.delete(`/api/buku/${bookId}`)
        toast.success('Buku berhasil dihapus')
        fetchBooks()
      } catch (error) {
        console.error('Error deleting book:', error)
        toast.error(error.response?.data?.message || 'Gagal menghapus buku')
      }
    }
  }

  const onSubmit = async (data) => {
    try {
      if (editingBook) {
        await axios.put(`/api/buku/${editingBook.id}`, data)
        toast.success('Buku berhasil diupdate')
      } else {
        await axios.post('/api/buku', data)
        toast.success('Buku berhasil ditambahkan')
      }
      setShowModal(false)
      reset()
      fetchBooks()
    } catch (error) {
      console.error('Error saving book:', error)
      toast.error(error.response?.data?.message || 'Gagal menyimpan buku')
    }
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Kelola Buku</h1>
          <p className="text-gray-600">Tambah, edit, dan hapus buku dalam katalog</p>
        </div>
        <button onClick={handleAddBook} className="btn-primary flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Tambah Buku</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari judul buku atau pengarang..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="md:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                className="input-field pl-10 appearance-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Semua Kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nama_kategori}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Buku
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stok
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lokasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {books.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                        {book.cover_url ? (
                          <img 
                            src={book.cover_url} 
                            alt={book.judul}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <BookOpen className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {book.judul}
                        </div>
                        <div className="text-sm text-gray-500">{book.pengarang}</div>
                        {book.penerbit && (
                          <div className="text-xs text-gray-400">{book.penerbit}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {book.nama_kategori || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {book.jumlah_tersedia} / {book.jumlah_total}
                    </div>
                    <div className={`text-xs ${
                      book.jumlah_tersedia > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {book.jumlah_tersedia > 0 ? 'Tersedia' : 'Habis'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {book.lokasi_rak || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditBook(book)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book.id, book.judul)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {books.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak Ada Buku</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory 
                ? 'Tidak ada buku yang sesuai dengan filter.'
                : 'Belum ada buku dalam katalog.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingBook ? 'Edit Buku' : 'Tambah Buku Baru'}
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Judul Buku *
                    </label>
                    <input
                      {...register('judul', { required: 'Judul buku diperlukan' })}
                      type="text"
                      className="input-field"
                      placeholder="Masukkan judul buku"
                    />
                    {errors.judul && (
                      <p className="mt-1 text-sm text-red-600">{errors.judul.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pengarang *
                    </label>
                    <input
                      {...register('pengarang', { required: 'Pengarang diperlukan' })}
                      type="text"
                      className="input-field"
                      placeholder="Masukkan nama pengarang"
                    />
                    {errors.pengarang && (
                      <p className="mt-1 text-sm text-red-600">{errors.pengarang.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Penerbit
                    </label>
                    <input
                      {...register('penerbit')}
                      type="text"
                      className="input-field"
                      placeholder="Masukkan nama penerbit"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tahun Terbit
                    </label>
                    <input
                      {...register('tahun_terbit')}
                      type="number"
                      className="input-field"
                      placeholder="2024"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ISBN
                    </label>
                    <input
                      {...register('isbn')}
                      type="text"
                      className="input-field"
                      placeholder="978-xxx-xxx-xxx-x"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori
                    </label>
                    <select {...register('kategori_id')} className="input-field">
                      <option value="">Pilih Kategori</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.nama_kategori}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jumlah Total *
                    </label>
                    <input
                      {...register('jumlah_total', { 
                        required: 'Jumlah total diperlukan',
                        min: { value: 1, message: 'Minimal 1 eksemplar' }
                      })}
                      type="number"
                      className="input-field"
                      placeholder="1"
                      min="1"
                    />
                    {errors.jumlah_total && (
                      <p className="mt-1 text-sm text-red-600">{errors.jumlah_total.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lokasi Rak
                    </label>
                    <input
                      {...register('lokasi_rak')}
                      type="text"
                      className="input-field"
                      placeholder="A-001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Cover
                  </label>
                  <input
                    {...register('cover_url')}
                    type="url"
                    className="input-field"
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    {...register('deskripsi')}
                    className="input-field"
                    rows="3"
                    placeholder="Deskripsi singkat tentang buku"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingBook ? 'Update' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminBuku