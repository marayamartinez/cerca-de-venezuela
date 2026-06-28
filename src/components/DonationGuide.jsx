import { useState } from 'react'
import { ChevronDown, UtensilsCrossed, Droplets, HeartPulse, HardHat, AlertCircle } from 'lucide-react'

const CATEGORIAS = [
  {
    id: 'alimentacion',
    titulo: 'Alimentación',
    icono: UtensilsCrossed,
    color: '#2E8BE0',
    colorFondo: '#EBF4FD',
    items: [
      'Agua potable embotellada',
      'Sueros orales',
      'Alimentos enlatados (indicar gramaje en la etiqueta)',
      'Galletas nutritivas y barras energéticas',
      'Frutos secos',
      'Frutas',
      'Leche líquida',
      'Compotas',
      'Fórmulas para niños',
    ],
  },
  {
    id: 'higiene',
    titulo: 'Higiene personal',
    icono: Droplets,
    color: '#0F9D63',
    colorFondo: '#DEF5EB',
    items: [
      'Crema dental',
      'Papel higiénico',
      'Pañales para bebés (indicar talla en la bolsa)',
      'Pañales para adultos (indicar talla en la bolsa)',
      'Toallitas húmedas',
      'Bolsas de basura resistentes',
    ],
  },
  {
    id: 'primeros_auxilios',
    titulo: 'Primeros auxilios',
    icono: HeartPulse,
    color: '#E8112D',
    colorFondo: '#FEE8EB',
    items: [
      'Guantes desechables',
      'Vendas',
      'Alcohol',
      'Jeringas / inyectadoras',
      'Curitas',
      'Agua oxigenada',
      'Paracetamol',
      'Ibuprofeno',
      'Mascarillas',
      'Solución salina',
      'Termómetro',
      'Medicamentos analgésicos y antialérgicos',
    ],
  },
  {
    id: 'rescatistas',
    titulo: 'Materiales para rescatistas',
    icono: HardHat,
    color: '#C47A00',
    colorFondo: '#FEF3DC',
    items: [
      'Cascos de protección',
      'Guantes de protección',
      'Linternas y lámparas frontales',
      'Cinceles y picos',
      'Tobos y palas',
      'Mandarria',
      'Disco de corte',
    ],
  },
]

function CategoriaAccordion({ cat }) {
  const [abierto, setAbierto] = useState(false)
  const Icono = cat.icono

  return (
    <div className="border border-[#E6EEF6] rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setAbierto((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[#F4F9FE]"
        aria-expanded={abierto}
      >
        <span
          className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: cat.colorFondo }}
        >
          <Icono className="w-4 h-4" style={{ color: cat.color }} />
        </span>
        <span
          className="flex-1 font-semibold text-[#0B335E] text-sm"
          style={{ letterSpacing: '-0.2px' }}
        >
          {cat.titulo}
        </span>
        <ChevronDown
          className="w-4 h-4 text-[#5A6B85] shrink-0 transition-transform duration-200"
          style={{ transform: abierto ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {abierto && (
        <div className="px-4 pb-4">
          <ul className="space-y-1.5">
            {cat.items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-[#5A6B85]">
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function DonationGuide() {
  const [abierto, setAbierto] = useState(false)

  return (
    <div className="px-4 pb-2">
      {/* Acordeón principal */}
      <div className="max-w-5xl mx-auto border border-[#E6EEF6] rounded-2xl overflow-hidden bg-white shadow-sm">
        <button
          onClick={() => setAbierto((v) => !v)}
          className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-[#F4F9FE] transition-colors"
          aria-expanded={abierto}
        >
          <span
            className="font-semibold text-[#0B335E] text-sm sm:text-base"
            style={{ letterSpacing: '-0.3px' }}
          >
            ¿Qué puedes donar y cómo identificarlo?
          </span>
          <ChevronDown
            className="w-5 h-5 text-[#2E8BE0] shrink-0 transition-transform duration-200"
            style={{ transform: abierto ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>

        {abierto && (
          <div className="px-5 pb-5 border-t border-[#E6EEF6]">
            {/* Nota de identificación */}
            <div className="mt-4 mb-4 flex items-start gap-3 bg-[#FEF3DC] border border-[#F5D78E] rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-[#C47A00] shrink-0 mt-0.5" />
              <p className="text-sm text-[#7A4F00] leading-snug">
                <span className="font-semibold">Por favor, identifica tu donación:</span>{' '}
                la ropa por género (niño/niña, hombre/mujer) y talla, y los enlatados por gramaje.
                Esto agiliza mucho la clasificación y entrega. ¡Gracias!
              </p>
            </div>

            {/* Subcategorías */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CATEGORIAS.map((cat) => (
                <CategoriaAccordion key={cat.id} cat={cat} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
