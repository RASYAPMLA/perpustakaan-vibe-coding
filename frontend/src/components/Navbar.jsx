import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { BookOpen, User, LogOut, Settings, LayoutDashboard, Bookmark } from 'lucide-react'

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-lg border-b border-slate-800/80">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 text-2xl font-extrabold tracking-tight group">
            <div className="p-2 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-xl shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-all duration-300">
              <BookOpen size={24} className="text-white" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300 group-hover:opacity-90 transition-opacity">
              Biblio<span className="text-brand-400 font-black">Tech</span>
            </span>
          </Link>

          <div className="flex items-center space-x-8">
            <Link 
              to="/buku" 
              className={`font-semibold transition-all duration-300 hover:text-brand-400 ${
                isActive('/buku') ? 'text-brand-400' : 'text-slate-300'
              }`}
            >
              Katalog Buku
            </Link>

            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`flex items-center space-x-1.5 font-semibold transition-all duration-300 hover:text-brand-400 ${
                    isActive('/dashboard') ? 'text-brand-400' : 'text-slate-300'
                  }`}
                >
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  to="/peminjaman" 
                  className={`flex items-center space-x-1.5 font-semibold transition-all duration-300 hover:text-brand-400 ${
                    isActive('/peminjaman') ? 'text-brand-400' : 'text-slate-300'
                  }`}
                >
                  <Bookmark size={16} />
                  <span>Peminjaman Saya</span>
                </Link>
                
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className={`flex items-center space-x-1.5 font-semibold transition-all duration-300 hover:text-brand-400 border border-brand-500/30 px-3 py-1.5 rounded-lg bg-brand-500/5 ${
                      isActive('/admin') || location.pathname.startsWith('/admin') ? 'text-brand-400 bg-brand-500/10 border-brand-500/55' : 'text-slate-300'
                    }`}
                  >
                    <Settings size={16} className="animate-spin-slow" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <div className="flex items-center space-x-4 border-l border-slate-800 pl-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-400 font-bold text-sm">
                      {user?.nama_lengkap?.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-slate-200 line-clamp-1 max-w-[120px]">{user?.nama_lengkap}</p>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-brand-400">
                        {user?.role}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 cursor-pointer"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4 border-l border-slate-800 pl-6">
                <Link to="/login" className="text-slate-300 hover:text-white font-semibold transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary py-2 px-5">
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar