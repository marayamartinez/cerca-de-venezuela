import { Heart } from 'lucide-react'

export default function Header() {
  return (
    <header
      className="w-full px-4 pt-10 pb-16 text-center"
      style={{
        background:
          'linear-gradient(180deg, #4DA0EC 0%, #7CBDF2 30%, #B6DBF9 60%, #E4F2FC 85%, #ffffff 100%)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="bg-white rounded-2xl p-2.5 shadow-md">
          <Heart className="w-6 h-6 text-[#2E8BE0]" fill="#2E8BE0" />
        </div>
        <span
          className="text-[#0B335E] font-semibold text-lg tracking-tight"
          style={{ letterSpacing: '-0.4px' }}
        >
          Cerca de Venezuela
        </span>
      </div>

      {/* Título principal */}
      <h1
        className="text-[#0B335E] font-bold text-3xl sm:text-4xl md:text-5xl leading-tight mb-4 max-w-2xl mx-auto"
        style={{ letterSpacing: '-0.8px' }}
      >
        Tu donación llega a quien más lo necesita
      </h1>

      {/* Subtítulo */}
      <p className="text-[#5A6B85] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
        Cada aporte suma. Encuentra el centro de acopio más cercano y lleva
        justo lo que hoy hace falta.
      </p>
    </header>
  )
}
