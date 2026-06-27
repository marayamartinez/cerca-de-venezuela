import CentroCard from './CentroCard'
import { Search } from 'lucide-react'

export default function ResultsList({ centros, categorias, ciudad }) {
  if (!ciudad) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#EBF4FD] flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-[#2E8BE0]" />
        </div>
        <p className="text-[#5A6B85] text-base max-w-xs">
          Usa tu ubicación o selecciona una ciudad para ver los centros de acopio disponibles.
        </p>
      </div>
    )
  }

  if (centros.length === 0) {
    return (
      <div className="py-16 px-4 text-center">
        <p className="text-[#5A6B85]">No hay centros registrados en {ciudad}.</p>
      </div>
    )
  }

  // Primero los abiertos, luego los cerrados
  const ordenados = [...centros].sort((a, b) => {
    if (a.abierto === b.abierto) return 0
    return a.abierto ? -1 : 1
  })

  return (
    <div className="px-4 pb-12">
      <p className="text-[#5A6B85] text-sm mb-5">
        <span className="font-semibold text-[#0B335E]">{centros.length}</span>{' '}
        {centros.length === 1 ? 'centro' : 'centros'} de acopio en{' '}
        <span className="font-semibold text-[#0B335E]">{ciudad}</span>
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ordenados.map((centro) => (
          <CentroCard key={centro.id} centro={centro} categorias={categorias} />
        ))}
      </div>
    </div>
  )
}
