import { useState, useEffect } from 'react'
import Header from './components/Header'
import SearchSection from './components/SearchSection'
import ResultsList from './components/ResultsList'
import DonationGuide from './components/DonationGuide'
import { getCentrosPorCiudad, getCategorias, getCiudades, getMostrarNecesidades } from './services/dataService'
import './index.css'

export default function App() {
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState('')
  const [ciudades, setCiudades] = useState([])
  const [centros, setCentros] = useState([])
  const [categorias, setCategorias] = useState([])
  const mostrarNecesidades = getMostrarNecesidades()

  useEffect(() => {
    getCiudades().then(setCiudades)
    getCategorias().then(setCategorias)
  }, [])

  useEffect(() => {
    if (!ciudadSeleccionada) {
      setCentros([])
      return
    }
    getCentrosPorCiudad(ciudadSeleccionada).then(setCentros)
  }, [ciudadSeleccionada])

  return (
    <div className="min-h-screen bg-[#F4F9FE]">
      <Header />
      <main className="max-w-5xl mx-auto">
        <SearchSection
          ciudades={ciudades}
          ciudadSeleccionada={ciudadSeleccionada}
          onCiudadChange={setCiudadSeleccionada}
        />
        <div className="py-4">
          <DonationGuide />
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
