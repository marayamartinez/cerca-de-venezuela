import { MapPin, Clock, AlertTriangle, CheckCircle2, XCircle, ExternalLink } from 'lucide-react'

const ESTADO_CONFIG = {
  urgente: {
    bg: '#FEE8EB',
    texto: '#E8112D',
    icono: <AlertTriangle className="w-3.5 h-3.5" />,
    label: 'URGENTE',
  },
  necesita: {
    bg: '#EBF4FD',
    texto: '#1F6FC4',
    icono: <CheckCircle2 className="w-3.5 h-3.5" />,
    label: 'Se necesita',
  },
  no_necesita: {
    bg: '#E9EEF3',
    texto: '#8A98AB',
    icono: <XCircle className="w-3.5 h-3.5" />,
    label: 'Ya no necesita',
    tachado: true,
  },
}

function NecesidadPill({ estado, label }) {
  const cfg = ESTADO_CONFIG[estado] || ESTADO_CONFIG.necesita
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: cfg.bg, color: cfg.texto }}
    >
      {cfg.icono}
      <span className={cfg.tachado ? 'line-through' : ''}>{label}</span>
    </span>
  )
}

export default function CentroCard({ centro, categorias, mostrarNecesidades }) {
  const estaAbierto = centro.abierto

  const urlMaps = centro.maps_url
    ? centro.maps_url
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${centro.direccion}, ${centro.ciudad}, Ecuador`
      )}`

  const getEstado = (catId) => centro.necesidades?.[catId] || 'necesita'

  return (
    <article
      className={`bg-white rounded-[18px] border border-[#E6EEF6] shadow-sm overflow-hidden flex flex-col transition-opacity ${
        !estaAbierto ? 'opacity-60' : ''
      }`}
    >
      {/* Cabecera de tarjeta */}
      <div className={`p-5 pb-4 ${mostrarNecesidades ? 'border-b border-[#E6EEF6]' : ''}`}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2
            className="text-[#0B335E] font-semibold text-base leading-tight"
            style={{ letterSpacing: '-0.3px' }}
          >
            {centro.local}
          </h2>
          {estaAbierto ? (
            <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#DEF5EB] text-[#0F9D63]">
              <span className="w-2 h-2 rounded-full bg-[#13B473] inline-block" />
              Abierto
            </span>
          ) : (
            <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E9EEF3] text-[#8A98AB]">
              <span className="w-2 h-2 rounded-full bg-[#8A98AB] inline-block" />
              Cerrado
            </span>
          )}
        </div>

        <div className="flex items-start gap-2 text-[#5A6B85] text-sm mb-2">
          <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#2E8BE0]" />
          <span>{centro.direccion}</span>
        </div>

        <div className="flex items-center gap-2 text-[#5A6B85] text-sm">
          <Clock className="w-4 h-4 shrink-0 text-[#2E8BE0]" />
          <span>{centro.horario}</span>
        </div>
      </div>

      {/* Necesidades — solo si mostrarNecesidades es true */}
      {mostrarNecesidades && (
        <div className="p-5 flex-1">
          <p className="text-[#5A6B85] text-xs font-semibold uppercase tracking-wide mb-3">
            Qué necesita ahora
          </p>
          <div className="flex flex-wrap gap-2">
            {categorias.map((cat) => (
              <NecesidadPill
                key={cat.id}
                estado={getEstado(cat.id)}
                label={cat.label}
              />
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-5 pb-5 mt-auto pt-4">
        <a
          href={urlMaps}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full border-2 border-[#2E8BE0] text-[#2E8BE0] font-semibold text-sm hover:bg-[#EBF4FD] transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Cómo llegar
        </a>
      </div>
    </article>
  )
}
