import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { BookOpen, Eye, EyeOff, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react'

const Login = () => {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, setValue } = useForm()

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const result = await login(data)
      if (result.success) {
        toast.success('Login berhasil! Selamat datang.')
        navigate('/dashboard')
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLogin = (roleType) => {
    setValue('username', roleType === 'admin' ? 'admin' : 'user1')
    setValue('password', 'password')
    toast.success(`Kredensial ${roleType === 'admin' ? 'Admin' : 'User'} terisi otomatis! Silakan klik Masuk.`)
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden animate-fade-in">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-brand-500/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 relative">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3.5 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-2xl shadow-xl shadow-brand-500/20">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-white tracking-tight">
            Masuk Ke Akun Anda
          </h2>
          <p className="text-sm text-slate-400">
            Belum punya akun?{' '}
            <Link to="/register" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors">
              Daftar akun baru gratis
            </Link>
          </p>
        </div>

        <div className="card border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-xs font-bold text-slate-300 uppercase tracking-widest">
                Username atau Email
              </label>
              <input
                {...register('username', { required: 'Username atau email diperlukan' })}
                type="text"
                className="input-field"
                placeholder="Masukkan username atau email"
              />
              {errors.username && (
                <p className="text-xs text-rose-400 font-semibold">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-bold text-slate-300 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password', { required: 'Password diperlukan' })}
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-12"
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-400 font-semibold">{errors.password.message}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 py-3"
              >
                <span>{isLoading ? 'Memproses Masuk...' : 'Masuk'}</span>
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </div>
          </form>

          {/* Premium Quick Login Selector */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-4">
              Pilih Akses Masuk Instan (Uji Coba)
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="flex flex-col items-center p-3 bg-slate-950/40 hover:bg-brand-500/10 border border-slate-800 hover:border-brand-500/30 rounded-xl transition-all duration-300 group text-center cursor-pointer"
              >
                <div className="p-2 bg-brand-500/10 text-brand-400 rounded-lg group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300 mb-2">
                  <ShieldCheck size={18} />
                </div>
                <span className="text-xs font-bold text-slate-200">Akses Admin</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Role Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('user')}
                className="flex flex-col items-center p-3 bg-slate-950/40 hover:bg-indigo-500/10 border border-slate-800 hover:border-indigo-500/30 rounded-xl transition-all duration-300 group text-center cursor-pointer"
              >
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300 mb-2">
                  <UserCheck size={18} />
                </div>
                <span className="text-xs font-bold text-slate-200">Akses User</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Role User</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login