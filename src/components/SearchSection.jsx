import { useState } from 'react'
import { MapPin, ChevronDown, Loader2 } from 'lucide-react'

// Coordenadas aproximadas de cada ciudad para el lookup por GPS
const COORDS_CIUDADES = {
  Quito: { lat: -0.2299, lng: -78.5249 },
  Guayaquil: { lat: -2.1709, lng: -79.9224 },
  Ambato: { lat: -1.2491, lng: -78.6167 },
  Latacunga: { lat: -0.9317, lng: -78.6149 },
  Babahoyo: { lat: -1.8013, lng: -79.5342 },
  'Santo Domingo de los Tsáchilas': { lat: -0.2533, lng: -79.1719 },
  Quevedo: { lat: -1.0225, lng: -79.4607 },
  Machala: { lat: -3.2581, lng: -79.9554 },
  'Sangolquí (Valle de los Chillos)': { lat: -0.3355, lng: -78.4468 },
}

function distanciaKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function SearchSection({ ciudades, ciudadSeleccionada, onCiudadChange }) {
  const [gpsLoading, setGpsLoading] = useState(false)
  const [gpsError, setGpsError] = useState('')

  const usarUbicacion = () => {
    if (!navigator.geolocation) {
      setGpsError('Tu navegador no soporta geolocalización.')
      return
    }
    setGpsLoading(true)
    setGpsError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        let ciudadMasCercana = null
        let menorDistancia = Infinity
        for (const [ciudad, coords] of Object.entries(COORDS_CIUDADES)) {
          const d = distanciaKm(latitude, longitude, coords.lat, coords.lng)
          if (d < menorDistancia) {
            menorDistancia = d
            ciudadMasCercana = ciudad
          }
        }
        if (ciudadMasCercana) onCiudadChange(ciudadMasCercana)
        setGpsLoading(false)
      },
      () => {
        setGpsError('No pudimos obtener tu ubicación. Selecciona tu ciudad manualmente.')
        setGpsLoading(false)
      }
    )
  }

  return (
    <div className="w-full bg-[#F4F9FE] rounded-t-[24px] -mt-6 px-4 pt-8 pb-6">
      <div className="max-w-xl mx-auto flex flex-col gap-3">
        {/* Botón GPS */}
        <button
          onClick={usarUbicacion}
          disabled={gpsLoading}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-white font-semibold text-base shadow-md disabled:opacity-70 transition-transform active:scale-[0.98]"
          style={{
            background: gpsLoading
              ? '#7CBDF2'
              : 'linear-gradient(135deg, #2E8BE0, #5FB0F5)',
          }}
        >
          {gpsLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <MapPin className="w-5 h-5" />
          )}
          {gpsLoading ? 'Buscando tu ubicación…' : 'Usar mi ubicación'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#E6EEF6]" />
          <span className="text-[#8A98AB] text-sm font-medium">o elige tu ciudad</span>
          <div className="flex-1 h-px bg-[#E6EEF6]" />
        </div>

        {/* Selector de ciudad */}
        <div className="relative">
          <select
            value={ciudadSeleccionada}
            onChange={(e) => onCiudadChange(e.target.value)}
            className="w-full appearance-none bg-white border border-[#E6EEF6] rounded-full py-3.5 pl-5 pr-12 text-[#0B335E] font-medium text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5FB0F5] cursor-pointer"
          >
            <option value="">Selecciona una ciudad…</option>
            {ciudades.map((ciudad) => (
              <option key={ciudad} value={ciudad}>
                {ciudad}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A6B85] pointer-events-none" />
        </div>

        {/* Error GPS */}
        {gpsError && (
          <p className="text-center text-sm text-urgente">{gpsError}</p>
        )}
      </div>
    </div>
  )
}
