import { useState } from 'react'
import { ChevronDown, AlertCircle, Package } from 'lucide-react'

function CategoriaAccordion({ cat }) {
  const [abierto, setAbierto] = useState(false)

  return (
    <div className="border border-[#E6EEF6] rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setAbierto((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[#F4F9FE]"
        aria-expanded={abierto}
      >
        <span className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center bg-[#EBF4FD]">
          <Package className="w-4 h-4 text-[#2E8BE0]" />
        </span>
        <span className="flex-1 font-semibold text-[#0B335E] text-sm" style={{ letterSpacing: '-0.2px' }}>
          {cat.nombre}
        </span>
        <ChevronDown
          className="w-4 h-4 text-[#5A6B85] shrink-0 transition-transform duration-200"
          style={{ transform: abierto ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {abierto && (
        <div className="px-4 pb-4">
          <ul className="space-y-1.5">
            {cat.articulos.map((art) => (
              <li key={art.id} className="flex items-start gap-2 text-sm text-[#5A6B85]">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-[#2E8BE0]" />
                {art.texto}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function DonationGuide({ categorias, nota }) {
  const [abierto, setAbierto] = useState(false)

  if (!categorias || categorias.length === 0) return null

  return (
    <div className="px-4 pb-2">
      <div className="max-w-5xl mx-auto border border-[#E6EEF6] rounded-2xl overflow-hidden bg-white shadow-sm">
        <button
          onClick={() => setAbierto((v) => !v)}
          className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-[#F4F9FE] transition-colors"
          aria-expanded={abierto}
        >
          <span className="font-semibold text-[#0B335E] text-sm sm:text-base" style={{ letterSpacing: '-0.3px' }}>
            ¿Qué puedes donar y cómo identificarlo?
          </span>
          <ChevronDown
            className="w-5 h-5 text-[#2E8BE0] shrink-0 transition-transform duration-200"
            style={{ transform: abierto ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>

        {abierto && (
          <div className="px-5 pb-5 border-t border-[#E6EEF6]">
            {nota && (
              <div className="mt-4 mb-4 flex items-start gap-3 bg-[#FEF3DC] border border-[#F5D78E] rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-[#C47A00] shrink-0 mt-0.5" />
                <p className="text-sm text-[#7A4F00] leading-snug">{nota}</p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categorias.map((cat) => (
                <CategoriaAccordion key={cat.id} cat={cat} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
