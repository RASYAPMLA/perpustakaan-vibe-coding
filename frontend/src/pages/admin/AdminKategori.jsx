import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Tag } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import axios from 'axios'

const AdminKategori = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/kategori')
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = () => {
    setEditingCategory(null)
    reset()
    setShowModal(true)
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setValue('nama_kategori', category.nama_kategori)
    setValue('deskripsi', category.deskripsi || '')
    setShowModal(true)
  }

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus kategori "${categoryName}"?`)) {
      try {
        await axios.delete(`/api/kategori/${categoryId}`)
        toast.success('Kategori berhasil dihapus')
        fetchCategories()
      } catch (error) {
        console.error('Error deleting category:', error)
        toast.error(error.response?.data?.message || 'Gagal menghapus kategori')
      }
    }
  }

  const onSubmit = async (data) => {
    try {
      if (editingCategory) {
        await axios.put(`/api/kategori/${editingCategory.id}`, data)
        toast.success('Kategori berhasil diupdate')
      } else {
        await axios.post('/api/kategori', data)
        toast.success('Kategori berhasil ditambahkan')
      }
      setShowModal(false)
      reset()
      fetchCategories()
    } catch (error) {
      console.error('Error saving category:', error)
      toast.error(error.response?.data?.message || 'Gagal menyimpan kategori')
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
          <h1 className="text-3xl font-bold text-gray-900">Kelola Kategori</h1>
          <p className="text-gray-600">Tambah, edit, dan hapus kategori buku</p>
        </div>
        <button onClick={handleAddCategory} className="btn-primary flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Tag className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {category.nama_kategori}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Dibuat: {new Date(category.created_at).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="text-blue-600 hover:text-blue-900 p-1"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id, category.nama_kategori)}
                  className="text-red-600 hover:text-red-900 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {category.deskripsi && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {category.deskripsi}
              </p>
            )}

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>ID: {category.id}</span>
                {/* You can add book count here if needed */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="card text-center py-12">
          <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Kategori</h3>
          <p className="text-gray-600 mb-6">
            Mulai dengan menambahkan kategori pertama untuk mengorganisir buku.
          </p>
          <button onClick={handleAddCategory} className="btn-primary">
            Tambah Kategori Pertama
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Kategori *
                  </label>
                  <input
                    {...register('nama_kategori', { required: 'Nama kategori diperlukan' })}
                    type="text"
                    className="input-field"
                    placeholder="Masukkan nama kategori"
                  />
                  {errors.nama_kategori && (
                    <p className="mt-1 text-sm text-red-600">{errors.nama_kategori.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    {...register('deskripsi')}
                    className="input-field"
                    rows="3"
                    placeholder="Deskripsi kategori (opsional)"
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
                    {editingCategory ? 'Update' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Category Statistics */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Statistik Kategori</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-900">{categories.length}</div>
            <div className="text-sm text-blue-600">Total Kategori</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-900">
              {categories.filter(c => c.deskripsi && c.deskripsi.trim() !== '').length}
            </div>
            <div className="text-sm text-green-600">Dengan Deskripsi</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-900">
              {new Date().getFullYear()}
            </div>
            <div className="text-sm text-purple-600">Tahun Aktif</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminKategori