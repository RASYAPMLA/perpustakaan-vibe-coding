import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Search, Filter } from 'lucide-react'
import axios from 'axios'

const BukuList = () => {
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

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

  const handleSearch = (e) => {
    e.preventDefault()
    fetchBooks()
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
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Katalog Buku</h1>
        <p className="text-gray-600">Temukan dan pinjam buku favorit Anda</p>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <form onSubmit={handleSearch} className="flex">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari judul buku atau pengarang..."
                  className="input-field pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary ml-2">
                Cari
              </button>
            </form>
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

      {/* Results */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Menampilkan {books.length} buku
          {searchTerm && ` untuk "${searchTerm}"`}
          {selectedCategory && ` dalam kategori "${categories.find(c => c.id == selectedCategory)?.nama_kategori}"`}
        </p>
        
        {(searchTerm || selectedCategory) && (
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('')
            }}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Books Grid */}
      {books.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex space-x-4 mb-4">
                <div className="w-20 h-28 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                  {book.cover_url ? (
                    <img 
                      src={book.cover_url} 
                      alt={book.judul}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <BookOpen className="h-10 w-10 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {book.judul}
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">{book.pengarang}</p>
                  {book.penerbit && (
                    <p className="text-gray-500 text-xs mb-2">{book.penerbit}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {book.nama_kategori && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {book.nama_kategori}
                      </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded ${
                      book.jumlah_tersedia > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {book.jumlah_tersedia > 0 
                        ? `Tersedia: ${book.jumlah_tersedia}` 
                        : 'Tidak Tersedia'
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {book.deskripsi && (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {book.deskripsi}
                  </p>
                )}
                <div className="flex justify-between items-center text-xs text-gray-500">
                  {book.tahun_terbit && <span>Tahun: {book.tahun_terbit}</span>}
                  {book.lokasi_rak && <span>Rak: {book.lokasi_rak}</span>}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <Link 
                  to={`/buku/${book.id}`}
                  className="w-full btn-primary text-center block"
                >
                  Lihat Detail & Pinjam
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || selectedCategory ? 'Tidak Ada Hasil' : 'Belum Ada Buku'}
          </h3>
          <p className="text-gray-600">
            {searchTerm || selectedCategory 
              ? 'Coba ubah kata kunci pencarian atau filter kategori.'
              : 'Belum ada buku yang tersedia dalam katalog.'
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default BukuList