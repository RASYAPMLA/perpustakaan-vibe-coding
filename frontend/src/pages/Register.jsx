import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { BookOpen, Eye, EyeOff, ShieldAlert, User, ArrowRight } from 'lucide-react'

const Register = () => {
  const { register: registerUser, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState('user')

  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const password = watch('password')

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const result = await registerUser({ ...data, role: selectedRole })
      if (result.success) {
        toast.success(`Registrasi Akun ${selectedRole === 'admin' ? 'Admin' : 'User'} berhasil! Silakan masuk.`)
        navigate('/login')
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat registrasi')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden animate-fade-in">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-brand-500/10 rounded-full blur-[85px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[85px] pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 relative">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3.5 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-2xl shadow-xl shadow-brand-500/20">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-white tracking-tight">
            Daftar Akun Baru
          </h2>
          <p className="text-sm text-slate-400">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors">
              Masuk di sini
            </Link>
          </p>
        </div>

        <div className="card border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl">
          {/* Dynamic Role Switcher Tab */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest text-center mb-3">
              Daftar Sebagai Tipe Akun
            </label>
            <div className="grid grid-cols-2 p-1 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <button
                type="button"
                onClick={() => setSelectedRole('user')}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  selectedRole === 'user'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User size={14} />
                <span>Anggota (User)</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldAlert size={14} />
                <span>Pengelola (Admin)</span>
              </button>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1">
              <label htmlFor="nama_lengkap" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Nama Lengkap
              </label>
              <input
                {...register('nama_lengkap', { required: 'Nama lengkap diperlukan' })}
                type="text"
                className="input-field"
                placeholder="Masukkan nama lengkap"
              />
              {errors.nama_lengkap && (
                <p className="text-xs text-rose-400 font-semibold">{errors.nama_lengkap.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="username" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Username
              </label>
              <input
                {...register('username', { 
                  required: 'Username diperlukan',
                  minLength: { value: 3, message: 'Username minimal 3 karakter' }
                })}
                type="text"
                className="input-field"
                placeholder="Masukkan username"
              />
              {errors.username && (
                <p className="text-xs text-rose-400 font-semibold">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Email
              </label>
              <input
                {...register('email', { 
                  required: 'Email diperlukan',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Format email tidak valid'
                  }
                })}
                type="email"
                className="input-field"
                placeholder="Masukkan email"
              />
              {errors.email && (
                <p className="text-xs text-rose-400 font-semibold">{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="password" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password', { 
                      required: 'Password diperlukan',
                      minLength: { value: 6, message: 'Minimal 6 karakter' }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className="input-field pr-10"
                    placeholder="Minimal 6 karakter"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-rose-400 font-semibold">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Konfirmasi
                </label>
                <input
                  {...register('confirmPassword', { 
                    required: 'Konfirmasi diperlukan',
                    validate: value => value === password || 'Password beda'
                  })}
                  type="password"
                  className="input-field"
                  placeholder="Ketik ulang"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-rose-400 font-semibold">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="alamat" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Alamat (Opsional)
              </label>
              <textarea
                {...register('alamat')}
                className="input-field py-2"
                rows="2"
                placeholder="Masukkan alamat"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="telepon" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Telepon (Opsional)
              </label>
              <input
                {...register('telepon')}
                type="tel"
                className="input-field"
                placeholder="Masukkan nomor telepon"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 py-3"
              >
                <span>{isLoading ? 'Mendaftarkan Akun...' : 'Daftar Sekarang'}</span>
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register