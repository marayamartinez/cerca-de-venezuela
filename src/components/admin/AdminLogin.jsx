import { useState } from 'react'
import { Heart, Lock } from 'lucide-react'

export default function AdminLogin({ onLogin }) {
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (clave === import.meta.env.VITE_ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', '1')
      onLogin()
    } else {
      setError('Clave incorrecta. Inténtalo de nuevo.')
      setClave('')
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: 'linear-gradient(180deg, #4DA0EC 0%, #7CBDF2 30%, #B6DBF9 60%, #E4F2FC 85%, #ffffff 100%)',
      }}
    >
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="bg-[#EBF4FD] rounded-2xl p-2.5">
            <Heart className="w-6 h-6 text-[#2E8BE0]" fill="#2E8BE0" />
          </div>
          <span className="text-[#0B335E] font-semibold text-lg" style={{ letterSpacing: '-0.4px' }}>
            Cerca de Venezuela
          </span>
        </div>

        <h1 className="text-[#0B335E] font-bold text-xl text-center mb-1" style={{ letterSpacing: '-0.5px' }}>
          Panel de administración
        </h1>
        <p className="text-[#5A6B85] text-sm text-center mb-6">Ingresa la clave para continuar</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A98AB]" />
            <input
              type="password"
              value={clave}
              onChange={(e) => { setClave(e.target.value); setError('') }}
              placeholder="Clave de acceso"
              className="w-full pl-11 pr-4 py-3.5 rounded-full border border-[#E6EEF6] text-[#0B335E] placeholder-[#8A98AB] focus:outline-none focus:ring-2 focus:ring-[#5FB0F5] text-sm"
              autoFocus
            />
          </div>

          {error && <p className="text-[#E8112D] text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3.5 rounded-full text-white font-semibold text-sm"
            style={{ background: 'linear-gradient(135deg, #2E8BE0, #5FB0F5)' }}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}
