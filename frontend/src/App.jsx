import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import BukuList from './pages/BukuList'
import BukuDetail from './pages/BukuDetail'
import PeminjamanList from './pages/PeminjamanList'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminBuku from './pages/admin/AdminBuku'
import AdminPeminjaman from './pages/admin/AdminPeminjaman'
import AdminKategori from './pages/admin/AdminKategori'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/buku" element={<BukuList />} />
              <Route path="/buku/:id" element={<BukuDetail />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/peminjaman" element={
                <ProtectedRoute>
                  <PeminjamanList />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin/buku" element={
                <AdminRoute>
                  <AdminBuku />
                </AdminRoute>
              } />
              <Route path="/admin/peminjaman" element={
                <AdminRoute>
                  <AdminPeminjaman />
                </AdminRoute>
              } />
              <Route path="/admin/kategori" element={
                <AdminRoute>
                  <AdminKategori />
                </AdminRoute>
              } />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App