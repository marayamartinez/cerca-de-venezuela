import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import {
  getCategoriasDonacion,
  createCategoriaDonacion,
  deleteCategoriaDonacion,
  updateCategoriaDonacion,
  createArticulo,
  updateArticulo,
  deleteArticulo,
  getConfig,
  setConfig,
} from '../../services/dataService'

function ArticuloRow({ art, onUpdate, onDelete }) {
  const [editando, setEditando] = useState(false)
  const [texto, setTexto] = useState(art.texto)
  const [guardando, setGuardando] = useState(false)

  const guardar = async () => {
    if (!texto.trim()) return
    setGuardando(true)
    await updateArticulo(art.id, texto.trim())
    onUpdate(art.id, texto.trim())
    setEditando(false)
    setGuardando(false)
  }

  return (
    <li className="flex items-center gap-2 group">
      {editando ? (
        <>
          <input
            autoFocus
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') guardar(); if (e.key === 'Escape') setEditando(false) }}
            className="flex-1 border border-[#5FB0F5] rounded-lg px-3 py-1.5 text-sm text-[#0B335E] focus:outline-none"
          />
          <button onClick={guardar} disabled={guardando} className="p-1.5 rounded-lg bg-[#DEF5EB] text-[#0F9D63]">
            <Check className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setEditando(false)} className="p-1.5 rounded-lg hover:bg-[#F4F9FE] text-[#8A98AB]">
            <X className="w-3.5 h-3.5" />
          </button>
        </>
      ) : (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E8BE0] shrink-0 mt-0.5" />
          <span className="flex-1 text-sm text-[#5A6B85]">{art.texto}</span>
          <div className="hidden group-hover:flex items-center gap-1">
            <button onClick={() => setEditando(true)} className="p-1.5 rounded-lg hover:bg-[#EBF4FD] text-[#2E8BE0]">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onDelete(art.id)} className="p-1.5 rounded-lg hover:bg-[#FEE8EB] text-[#E8112D]">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}
    </li>
  )
}

function CategoriaCard({ cat, onDeleted, onUpdated }) {
  const [articulos, setArticulos] = useState(cat.articulos)
  const [nuevoTexto, setNuevoTexto] = useState('')
  const [agregando, setAgregando] = useState(false)
  const [editandoNombre, setEditandoNombre] = useState(false)
  const [nombre, setNombre] = useState(cat.nombre)

  const handleAddArticulo = async (e) => {
    e.preventDefault()
    if (!nuevoTexto.trim()) return
    const created = await createArticulo(cat.id, nuevoTexto.trim())
    setArticulos((prev) => [...prev, created])
    setNuevoTexto('')
    setAgregando(false)
  }

  const handleUpdateArticulo = (id, texto) => {
    setArticulos((prev) => prev.map((a) => a.id === id ? { ...a, texto } : a))
  }

  const handleDeleteArticulo = async (id) => {
    await deleteArticulo(id)
    setArticulos((prev) => prev.filter((a) => a.id !== id))
  }

  const handleGuardarNombre = async () => {
    if (!nombre.trim()) return
    await updateCategoriaDonacion(cat.id, nombre.trim())
    onUpdated(cat.id, nombre.trim())
    setEditandoNombre(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E6EEF6] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-[#F4F9FE] border-b border-[#E6EEF6]">
        {editandoNombre ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              autoFocus
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleGuardarNombre(); if (e.key === 'Escape') setEditandoNombre(false) }}
              className="flex-1 border border-[#5FB0F5] rounded-lg px-3 py-1.5 text-sm font-semibold text-[#0B335E] focus:outline-none"
            />
            <button onClick={handleGuardarNombre} className="p-1.5 rounded-lg bg-[#DEF5EB] text-[#0F9D63]">
              <Check className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setEditandoNombre(false)} className="p-1.5 rounded-lg hover:bg-[#F4F9FE] text-[#8A98AB]">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-semibold text-[#0B335E] text-sm">{nombre}</h3>
            <div className="flex items-center gap-1">
              <button onClick={() => setEditandoNombre(true)} className="p-1.5 rounded-lg hover:bg-[#EBF4FD] text-[#2E8BE0]">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDeleted(cat.id)} className="p-1.5 rounded-lg hover:bg-[#FEE8EB] text-[#E8112D]">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}
      </div>

      <div className="p-4">
        <ul className="flex flex-col gap-2 mb-3">
          {articulos.map((art) => (
            <ArticuloRow
              key={art.id}
              art={art}
              onUpdate={handleUpdateArticulo}
              onDelete={handleDeleteArticulo}
            />
          ))}
        </ul>

        {agregando ? (
          <form onSubmit={handleAddArticulo} className="flex gap-2">
            <input
              autoFocus
              value={nuevoTexto}
              onChange={(e) => setNuevoTexto(e.target.value)}
              placeholder="Nuevo artículo…"
              className="flex-1 border border-[#5FB0F5] rounded-lg px-3 py-2 text-sm text-[#0B335E] focus:outline-none"
            />
            <button type="submit" className="p-2 rounded-lg bg-[#DEF5EB] text-[#0F9D63]">
              <Check className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => setAgregando(false)} className="p-2 rounded-lg hover:bg-[#F4F9FE] text-[#8A98AB]">
              <X className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <button
            onClick={() => setAgregando(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#2E8BE0] hover:text-[#1F6FC4]"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar artículo
          </button>
        )}
      </div>
    </div>
  )
}

export default function DonarTab() {
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [nuevaCat, setNuevaCat] = useState('')
  const [agregandoCat, setAgregandoCat] = useState(false)
  const [nota, setNota] = useState('')
  const [notaGuardada, setNotaGuardada] = useState(false)

  const cargar = useCallback(async () => {
    setCargando(true)
    const [cats, notaVal] = await Promise.all([
      getCategoriasDonacion(),
      getConfig('nota_identificacion'),
    ])
    setCategorias(cats)
    setNota(notaVal || '')
    setCargando(false)
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const handleAddCategoria = async (e) => {
    e.preventDefault()
    if (!nuevaCat.trim()) return
    const created = await createCategoriaDonacion(nuevaCat.trim())
    setCategorias((prev) => [...prev, { ...created, articulos: [] }])
    setNuevaCat('')
    setAgregandoCat(false)
  }

  const handleDeleteCategoria = async (id) => {
    await deleteCategoriaDonacion(id)
    setCategorias((prev) => prev.filter((c) => c.id !== id))
  }

  const handleUpdateCategoria = (id, nombre) => {
    setCategorias((prev) => prev.map((c) => c.id === id ? { ...c, nombre } : c))
  }

  const guardarNota = async () => {
    await setConfig('nota_identificacion', nota)
    setNotaGuardada(true)
    setTimeout(() => setNotaGuardada(false), 2000)
  }

  if (cargando) return <p className="text-center text-[#5A6B85] py-12">Cargando…</p>

  return (
    <div className="flex flex-col gap-6">
      {/* Nota de identificación */}
      <div className="bg-white rounded-2xl border border-[#E6EEF6] p-4">
        <p className="text-xs font-bold text-[#5A6B85] uppercase tracking-wide mb-2">Nota de identificación</p>
        <textarea
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          rows={3}
          className="w-full border border-[#E6EEF6] rounded-xl px-4 py-3 text-sm text-[#0B335E] focus:outline-none focus:ring-2 focus:ring-[#5FB0F5] resize-none mb-3"
        />
        <button
          onClick={guardarNota}
          className="px-5 py-2 rounded-full text-white text-sm font-semibold transition-colors"
          style={{ background: notaGuardada ? '#0F9D63' : 'linear-gradient(135deg, #2E8BE0, #5FB0F5)' }}
        >
          {notaGuardada ? '✓ Guardado' : 'Guardar nota'}
        </button>
      </div>

      {/* Categorías */}
      <div className="flex flex-col gap-3">
        {categorias.map((cat) => (
          <CategoriaCard
            key={cat.id}
            cat={cat}
            onDeleted={handleDeleteCategoria}
            onUpdated={handleUpdateCategoria}
          />
        ))}
      </div>

      {/* Nueva categoría */}
      {agregandoCat ? (
        <form onSubmit={handleAddCategoria} className="flex gap-2">
          <input
            autoFocus
            value={nuevaCat}
            onChange={(e) => setNuevaCat(e.target.value)}
            placeholder="Nombre de la categoría…"
            className="flex-1 border border-[#5FB0F5] rounded-xl px-4 py-3 text-sm text-[#0B335E] focus:outline-none"
          />
          <button type="submit" className="px-4 py-2 rounded-xl bg-[#DEF5EB] text-[#0F9D63] font-semibold text-sm">
            Agregar
          </button>
          <button type="button" onClick={() => setAgregandoCat(false)} className="px-4 py-2 rounded-xl hover:bg-[#F4F9FE] text-[#8A98AB] text-sm">
            Cancelar
          </button>
        </form>
      ) : (
        <button
          onClick={() => setAgregandoCat(true)}
          className="flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-[#C8DFF7] text-[#2E8BE0] font-semibold text-sm hover:bg-[#EBF4FD] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva categoría
        </button>
      )}
    </div>
  )
}
