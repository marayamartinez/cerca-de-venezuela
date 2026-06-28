import { useState } from 'react'
import { X } from 'lucide-react'
import NecesidadesEditor from './NecesidadesEditor'
import { createCentro, updateCentro } from '../../services/dataService'

const CIUDADES = [
  'Ambato', 'Babahoyo', 'Baños de Agua Santa', 'Cuenca', 'Guayaquil',
  'Ibarra', 'La Aurora', 'Latacunga', 'Machala', 'Quevedo', 'Quito',
  'Santo Domingo de los Tsáchilas',
]

const VACIO = {
  ciudad: '', local: '', direccion: '', horario: '',
  maps_url: '', abierto: true, necesidades: {},
}

export default function CentroForm({ centro, categorias, mostrarNecesidades, onClose, onSaved }) {
  const esNuevo = !centro
  const [form, setForm] = useState(
    centro
      ? { ...centro, maps_url: centro.maps_url || '', necesidades: centro.necesidades || {} }
      : VACIO
  )
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const set = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.ciudad || !form.local || !form.direccion || !form.horario) {
      setError('Ciudad, nombre, dirección y horario son obligatorios.')
      return
    }
    setGuardando(true)
    setError('')
    try {
      const payload = {
        ciudad: form.ciudad.trim(),
        local: form.local.trim(),
        direccion: form.direccion.trim(),
        horario: form.horario.trim(),
        maps_url: form.maps_url.trim() || null,
        abierto: form.abierto,
        necesidades: form.necesidades,
      }
      if (esNuevo) {
        await createCentro(payload)
      } else {
        await updateCentro(centro.id, payload)
      }
      onSaved()
    } catch (err) {
      setError('Error al guardar: ' + err.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6EEF6] sticky top-0 bg-white z-10">
          <h2 className="font-bold text-[#0B335E] text-base" style={{ letterSpacing: '-0.3px' }}>
            {esNuevo ? 'Agregar centro' : 'Editar centro'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[#F4F9FE] text-[#5A6B85]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {/* Ciudad */}
          <div>
            <label className="block text-xs font-semibold text-[#5A6B85] mb-1.5 uppercase tracking-wide">Ciudad *</label>
            <select
              value={form.ciudad}
              onChange={(e) => set('ciudad', e.target.value)}
              className="w-full border border-[#E6EEF6] rounded-xl px-4 py-3 text-[#0B335E] text-sm focus:outline-none focus:ring-2 focus:ring-[#5FB0F5]"
            >
              <option value="">Selecciona ciudad…</option>
              {CIUDADES.map((c) => <option key={c} value={c}>{c}</option>)}
              <option value="__otra">Otra ciudad…</option>
            </select>
            {form.ciudad === '__otra' && (
              <input
                type="text"
                placeholder="Escribe el nombre de la ciudad"
                className="mt-2 w-full border border-[#E6EEF6] rounded-xl px-4 py-3 text-[#0B335E] text-sm focus:outline-none focus:ring-2 focus:ring-[#5FB0F5]"
                onChange={(e) => set('ciudad', e.target.value)}
              />
            )}
          </div>

          {/* Nombre del local */}
          <div>
            <label className="block text-xs font-semibold text-[#5A6B85] mb-1.5 uppercase tracking-wide">Nombre del local *</label>
            <input
              type="text"
              value={form.local}
              onChange={(e) => set('local', e.target.value)}
              placeholder="Ej. Restaurante Don Lucho"
              className="w-full border border-[#E6EEF6] rounded-xl px-4 py-3 text-[#0B335E] text-sm focus:outline-none focus:ring-2 focus:ring-[#5FB0F5]"
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-xs font-semibold text-[#5A6B85] mb-1.5 uppercase tracking-wide">Dirección *</label>
            <textarea
              value={form.direccion}
              onChange={(e) => set('direccion', e.target.value)}
              placeholder="Dirección completa con referencias"
              rows={2}
              className="w-full border border-[#E6EEF6] rounded-xl px-4 py-3 text-[#0B335E] text-sm focus:outline-none focus:ring-2 focus:ring-[#5FB0F5] resize-none"
            />
          </div>

          {/* Horario */}
          <div>
            <label className="block text-xs font-semibold text-[#5A6B85] mb-1.5 uppercase tracking-wide">Horario *</label>
            <input
              type="text"
              value={form.horario}
              onChange={(e) => set('horario', e.target.value)}
              placeholder="Ej. 9:00 AM a 6:00 PM"
              className="w-full border border-[#E6EEF6] rounded-xl px-4 py-3 text-[#0B335E] text-sm focus:outline-none focus:ring-2 focus:ring-[#5FB0F5]"
            />
          </div>

          {/* Maps URL */}
          <div>
            <label className="block text-xs font-semibold text-[#5A6B85] mb-1.5 uppercase tracking-wide">Enlace Google Maps (opcional)</label>
            <input
              type="url"
              value={form.maps_url}
              onChange={(e) => set('maps_url', e.target.value)}
              placeholder="https://maps.app.goo.gl/..."
              className="w-full border border-[#E6EEF6] rounded-xl px-4 py-3 text-[#0B335E] text-sm focus:outline-none focus:ring-2 focus:ring-[#5FB0F5]"
            />
          </div>

          {/* Estado */}
          <div className="flex items-center justify-between bg-[#F4F9FE] rounded-xl px-4 py-3">
            <span className="text-sm font-semibold text-[#0B335E]">Estado del centro</span>
            <button
              type="button"
              onClick={() => set('abierto', !form.abierto)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.abierto ? 'bg-[#0F9D63]' : 'bg-[#8A98AB]'}`}
            >
              <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${form.abierto ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <p className="text-xs text-[#5A6B85] -mt-2 px-1">
            {form.abierto ? '✅ Abierto — visible y activo' : '🔴 Cerrado — aparece atenuado'}
          </p>

          {/* Necesidades */}
          {mostrarNecesidades && categorias.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[#5A6B85] mb-3 uppercase tracking-wide">Necesidades por categoría</p>
              <NecesidadesEditor
                categorias={categorias}
                necesidades={form.necesidades}
                onChange={(n) => set('necesidades', n)}
              />
            </div>
          )}

          {error && <p className="text-[#E8112D] text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full border-2 border-[#E6EEF6] text-[#5A6B85] font-semibold text-sm hover:bg-[#F4F9FE]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="flex-1 py-3 rounded-full text-white font-semibold text-sm disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #2E8BE0, #5FB0F5)' }}
            >
              {guardando ? 'Guardando…' : esNuevo ? 'Agregar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
