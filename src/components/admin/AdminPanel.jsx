import { useState, useEffect } from 'react'
import { Heart, LogOut, Settings } from 'lucide-react'
import CentrosTab from './CentrosTab'
import DonarTab from './DonarTab'
import CategoriasNecesidadEditor from './CategoriasNecesidadEditor'
import { getCategorias, getConfig, setConfig } from '../../services/dataService'

const TABS = [
  { id: 'centros', label: 'Centros' },
  { id: 'donar', label: 'Qué donar' },
  { id: 'config', label: 'Configuración' },
]

function ConfigTab() {
  const [banner, setBanner] = useState('')
  const [bannerGuardado, setBannerGuardado] = useState(false)

  useEffect(() => {
    getConfig('banner_texto').then((v) => setBanner(v || ''))
  }, [])

  const guardarBanner = async () => {
    await setConfig('banner_texto', banner)
    setBannerGuardado(true)
    setTimeout(() => setBannerGuardado(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl border border-[#E6EEF6] p-4">
        <p className="text-xs font-bold text-[#5A6B85] uppercase tracking-wide mb-2">Etiquetas de necesidad</p>
        <p className="text-xs text-[#8A98AB] mb-3">Las etiquetas que aparecen en cada centro (alimentos, ropa, etc.). Puedes agregar, renombrar o eliminarlas.</p>
        <CategoriasNecesidadEditor />
      </div>

      <div className="bg-white rounded-2xl border border-[#E6EEF6] p-4">
        <p className="text-xs font-bold text-[#5A6B85] uppercase tracking-wide mb-2">Texto del banner</p>
        <p className="text-xs text-[#8A98AB] mb-3">Aparece en la franja azul arriba de la página pública.</p>
        <textarea
          value={banner}
          onChange={(e) => setBanner(e.target.value)}
          rows={3}
          className="w-full border border-[#E6EEF6] rounded-xl px-4 py-3 text-sm text-[#0B335E] focus:outline-none focus:ring-2 focus:ring-[#5FB0F5] resize-none mb-3"
        />
        <button
          onClick={guardarBanner}
          className="px-5 py-2 rounded-full text-white text-sm font-semibold"
          style={{ background: bannerGuardado ? '#0F9D63' : 'linear-gradient(135deg, #2E8BE0, #5FB0F5)' }}
        >
          {bannerGuardado ? '✓ Guardado' : 'Guardar banner'}
        </button>
      </div>
    </div>
  )
}

export default function AdminPanel({ onLogout }) {
  const [tab, setTab] = useState('centros')
  const [categorias, setCategorias] = useState([])
  const [mostrarNecesidades, setMostrarNecesidades] = useState(false)
  const [guardandoToggle, setGuardandoToggle] = useState(false)

  useEffect(() => {
    getCategorias().then(setCategorias)
    getConfig('mostrar_necesidades').then((v) => setMostrarNecesidades(v === 'true'))
  }, [])

  const toggleNecesidades = async () => {
    setGuardandoToggle(true)
    const nuevo = !mostrarNecesidades
    await setConfig('mostrar_necesidades', String(nuevo))
    setMostrarNecesidades(nuevo)
    setGuardandoToggle(false)
  }

  return (
    <div className="min-h-screen bg-[#F4F9FE]">
      {/* Header */}
      <header
        className="px-4 py-4"
        style={{ background: 'linear-gradient(180deg, #4DA0EC 0%, #7CBDF2 60%, #B6DBF9 100%)' }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-xl p-1.5 shadow-sm">
              <Heart className="w-4 h-4 text-[#2E8BE0]" fill="#2E8BE0" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none" style={{ letterSpacing: '-0.3px' }}>
                Cerca de Venezuela
              </p>
              <p className="text-blue-100 text-xs">Panel de administración</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-2 rounded-full transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Salir
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5">
        {/* Toggle global necesidades */}
        <div className="bg-white rounded-2xl border border-[#E6EEF6] px-4 py-3.5 mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[#0B335E] font-semibold text-sm">Mostrar etiquetas de necesidades</p>
            <p className="text-[#8A98AB] text-xs mt-0.5">
              {mostrarNecesidades ? 'Activado — visible en la página pública' : 'Desactivado — las etiquetas están ocultas'}
            </p>
          </div>
          <button
            onClick={toggleNecesidades}
            disabled={guardandoToggle}
            className={`relative shrink-0 inline-flex h-7 w-12 items-center rounded-full transition-colors disabled:opacity-50 ${mostrarNecesidades ? 'bg-[#0F9D63]' : 'bg-[#8A98AB]'}`}
          >
            <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${mostrarNecesidades ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl p-1 border border-[#E6EEF6] mb-5">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === t.id
                  ? 'bg-[#EBF4FD] text-[#2E8BE0]'
                  : 'text-[#5A6B85] hover:text-[#0B335E]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Contenido */}
        {tab === 'centros' && (
          <CentrosTab categorias={categorias} mostrarNecesidades={mostrarNecesidades} />
        )}
        {tab === 'donar' && <DonarTab />}
        {tab === 'config' && <ConfigTab />}
      </main>
    </div>
  )
}
