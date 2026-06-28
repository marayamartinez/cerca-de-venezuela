import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Banner from './components/Banner'
import SearchSection from './components/SearchSection'
import ResultsList from './components/ResultsList'
import DonationGuide from './components/DonationGuide'
import AdminLogin from './components/admin/AdminLogin'
import AdminPanel from './components/admin/AdminPanel'
import {
  getCentrosPorCiudad,
  getCategorias,
  getCiudades,
  getConfig,
  getCategoriasDonacion,
} from './services/dataService'
import './index.css'

function PaginaPublica() {
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState('')
  const [ciudades, setCiudades] = useState([])
  const [centros, setCentros] = useState([])
  const [categorias, setCategorias] = useState([])
  const [mostrarNecesidades, setMostrarNecesidades] = useState(false)
  const [bannerTexto, setBannerTexto] = useState('')
  const [categoriasDonacion, setCategoriasDonacion] = useState([])
  const [notaIdentificacion, setNotaIdentificacion] = useState('')

  useEffect(() => {
    getCiudades().then(setCiudades)
    getCategorias().then(setCategorias)
    getCategoriasDonacion().then(setCategoriasDonacion)
    getConfig('mostrar_necesidades').then((v) => setMostrarNecesidades(v === 'true'))
    getConfig('banner_texto').then((v) => setBannerTexto(v || ''))
    getConfig('nota_identificacion').then((v) => setNotaIdentificacion(v || ''))
  }, [])

  useEffect(() => {
    if (!ciudadSeleccionada) { setCentros([]); return }
    getCentrosPorCiudad(ciudadSeleccionada).then(setCentros)
  }, [ciudadSeleccionada])

  return (
    <div className="min-h-screen bg-[#F4F9FE]">
      <Banner texto={bannerTexto} />
      <Header />
      <main className="max-w-5xl mx-auto">
        <SearchSection
          ciudades={ciudades}
          ciudadSeleccionada={ciudadSeleccionada}
          onCiudadChange={setCiudadSeleccionada}
        />
        <div className="py-4">
          <DonationGuide categorias={categoriasDonacion} nota={notaIdentificacion} />
        </div>
        <ResultsList
          centros={centros}
          categorias={categorias}
          ciudad={ciudadSeleccionada}
          mostrarNecesidades={mostrarNecesidades}
        />
      </main>
      <footer className="text-center py-8 text-[#8A98AB] text-sm border-t border-[#E6EEF6]">
        Iniciativa de ayuda solidaria para Venezuela · Ecuador
      </footer>
    </div>
  )
}

function AdminRoute() {
  const [autenticado, setAutenticado] = useState(
    () => sessionStorage.getItem('admin_auth') === '1'
  )

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth')
    setAutenticado(false)
  }

  if (!autenticado) return <AdminLogin onLogin={() => setAutenticado(true)} />
  return <AdminPanel onLogout={handleLogout} />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PaginaPublica />} />
      <Route path="/admin" element={<AdminRoute />} />
    </Routes>
  )
}
