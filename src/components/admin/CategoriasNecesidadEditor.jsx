import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import {
  getCategorias,
  createCategoriaNecesidad,
  updateCategoriaNecesidad,
  deleteCategoriaNecesidad,
} from '../../services/dataService'

function CategoriaRow({ cat, onUpdated, onDeleted }) {
  const [editando, setEditando] = useState(false)
  const [label, setLabel] = useState(cat.label)
  const [guardando, setGuardando] = useState(false)

  const guardar = async () => {
    if (!label.trim()) return
    setGuardando(true)
    await updateCategoriaNecesidad(cat._dbId, label.trim())
    onUpdated(cat._dbId, label.trim())
    setEditando(false)
    setGuardando(false)
  }

  return (
    <div className="flex items-center gap-2 bg-white rounded-xl border border-[#E6EEF6] px-4 py-3 group">
      {editando ? (
        <>
          <input
            autoFocus
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') guardar(); if (e.key === 'Escape') setEditando(false) }}
            className="flex-1 border border-[#5FB0F5] rounded-lg px-3 py-1.5 text-sm text-[#0B335E] focus:outline-none"
          />
          <button onClick={guardar} disabled={guardando} className="p-1.5 rounded-lg bg-[#DEF5EB] text-[#0F9D63]">
            <Check className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => { setEditando(false); setLabel(cat.label) }} className="p-1.5 rounded-lg hover:bg-[#F4F9FE] text-[#8A98AB]">
            <X className="w-3.5 h-3.5" />
          </button>
        </>
      ) : (
        <>
          <span className="flex-1 text-sm text-[#0B335E] font-medium">{cat.label}</span>
          <div className="hidden group-hover:flex items-center gap-1">
            <button onClick={() => setEditando(true)} className="p-1.5 rounded-lg hover:bg-[#EBF4FD] text-[#2E8BE0]">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onDeleted(cat._dbId)} className="p-1.5 rounded-lg hover:bg-[#FEE8EB] text-[#E8112D]">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function CategoriasNecesidadEditor() {
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [nuevaLabel, setNuevaLabel] = useState('')
  const [agregando, setAgregando] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const cargar = useCallback(async () => {
    setCargando(true)
    const cats = await getCategorias()
    setCategorias(cats)
    setCargando(false)
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!nuevaLabel.trim()) return
    setErrorMsg('')
    try {
      const created = await createCategoriaNecesidad(nuevaLabel.trim())
      setCategorias((prev) => [...prev, created])
      setNuevaLabel('')
      setAgregando(false)
    } catch (err) {
      setErrorMsg('Error al guardar: ' + err.message)
    }
  }

  const handleUpdated = (dbId, label) => {
    setCategorias((prev) => prev.map((c) => c._dbId === dbId ? { ...c, label } : c))
  }

  const handleDeleted = async (dbId) => {
    await deleteCategoriaNecesidad(dbId)
    setCategorias((prev) => prev.filter((c) => c._dbId !== dbId))
  }

  if (cargando) return <p className="text-sm text-[#8A98AB] py-2">Cargando…</p>

  return (
    <div className="flex flex-col gap-2">
      {categorias.map((cat) => (
        <CategoriaRow
          key={cat._dbId}
          cat={cat}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      ))}

      {agregando ? (
        <form onSubmit={handleAdd} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              autoFocus
              value={nuevaLabel}
              onChange={(e) => { setNuevaLabel(e.target.value); setErrorMsg('') }}
              onKeyDown={(e) => { if (e.key === 'Escape') { setAgregando(false); setErrorMsg('') } }}
              placeholder="Nombre de la etiqueta…"
              className="flex-1 border border-[#5FB0F5] rounded-xl px-4 py-2.5 text-sm text-[#0B335E] focus:outline-none"
            />
            <button type="submit" className="px-4 py-2 rounded-xl bg-[#DEF5EB] text-[#0F9D63] font-semibold text-sm">
              Agregar
            </button>
            <button type="button" onClick={() => { setAgregando(false); setErrorMsg('') }} className="px-3 py-2 rounded-xl hover:bg-[#F4F9FE] text-[#8A98AB] text-sm">
              Cancelar
            </button>
          </div>
          {errorMsg && <p className="text-xs text-[#E8112D]">{errorMsg}</p>}
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setAgregando(true)}
          className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[#C8DFF7] text-[#2E8BE0] font-semibold text-sm hover:bg-[#EBF4FD] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva etiqueta
        </button>
      )}
    </div>
  )
}
