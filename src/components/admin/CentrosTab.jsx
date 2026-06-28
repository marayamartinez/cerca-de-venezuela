import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import CentroForm from './CentroForm'
import { getAllCentros, updateCentro, deleteCentro } from '../../services/dataService'

export default function CentrosTab({ categorias, mostrarNecesidades }) {
  const [centros, setCentros] = useState([])
  const [cargando, setCargando] = useState(true)
  const [formAbierto, setFormAbierto] = useState(false)
  const [centroEditando, setCentroEditando] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    const data = await getAllCentros()
    setCentros(data)
    setCargando(false)
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const toggleAbierto = async (centro) => {
    await updateCentro(centro.id, { abierto: !centro.abierto })
    setCentros((prev) =>
      prev.map((c) => c.id === centro.id ? { ...c, abierto: !c.abierto } : c)
    )
  }

  const handleDelete = async (id) => {
    await deleteCentro(id)
    setCentros((prev) => prev.filter((c) => c.id !== id))
    setConfirmDelete(null)
  }

  const handleSaved = () => {
    setFormAbierto(false)
    setCentroEditando(null)
    cargar()
  }

  // Agrupar por ciudad
  const porCiudad = centros.reduce((acc, c) => {
    if (!acc[c.ciudad]) acc[c.ciudad] = []
    acc[c.ciudad].push(c)
    return acc
  }, {})

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[#5A6B85] text-sm">{centros.length} centros en total</p>
        <button
          onClick={() => { setCentroEditando(null); setFormAbierto(true) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #2E8BE0, #5FB0F5)' }}
        >
          <Plus className="w-4 h-4" />
          Agregar centro
        </button>
      </div>

      {cargando ? (
        <p className="text-center text-[#5A6B85] py-12">Cargando centros…</p>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(porCiudad).sort(([a], [b]) => a.localeCompare(b)).map(([ciudad, lista]) => (
            <div key={ciudad}>
              <h3 className="text-xs font-bold text-[#5A6B85] uppercase tracking-wider mb-2 px-1">{ciudad}</h3>
              <div className="flex flex-col gap-2">
                {lista.map((centro) => (
                  <div
                    key={centro.id}
                    className={`bg-white rounded-2xl border border-[#E6EEF6] px-4 py-3.5 flex items-center gap-3 ${!centro.abierto ? 'opacity-60' : ''}`}
                  >
                    {/* Toggle abierto */}
                    <button
                      onClick={() => toggleAbierto(centro)}
                      className={`relative shrink-0 inline-flex h-6 w-11 items-center rounded-full transition-colors ${centro.abierto ? 'bg-[#0F9D63]' : 'bg-[#8A98AB]'}`}
                      title={centro.abierto ? 'Marcar como cerrado' : 'Marcar como abierto'}
                    >
                      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${centro.abierto ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[#0B335E] font-semibold text-sm truncate">{centro.local}</p>
                      <p className="text-[#5A6B85] text-xs truncate">{centro.direccion}</p>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => { setCentroEditando(centro); setFormAbierto(true) }}
                        className="p-2 rounded-xl hover:bg-[#EBF4FD] text-[#2E8BE0] transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(centro)}
                        className="p-2 rounded-xl hover:bg-[#FEE8EB] text-[#E8112D] transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal formulario */}
      {formAbierto && (
        <CentroForm
          centro={centroEditando}
          categorias={categorias}
          mostrarNecesidades={mostrarNecesidades}
          onClose={() => { setFormAbierto(false); setCentroEditando(null) }}
          onSaved={handleSaved}
        />
      )}

      {/* Modal confirmación borrar */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-[#0B335E] text-base mb-2">¿Eliminar este centro?</h3>
            <p className="text-[#5A6B85] text-sm mb-5">
              <span className="font-semibold">{confirmDelete.local}</span> — esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-3 rounded-full border-2 border-[#E6EEF6] text-[#5A6B85] font-semibold text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete.id)}
                className="flex-1 py-3 rounded-full bg-[#E8112D] text-white font-semibold text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
