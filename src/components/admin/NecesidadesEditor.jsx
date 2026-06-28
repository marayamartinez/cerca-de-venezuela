const ESTADOS = [
  { value: 'urgente', label: 'URGENTE', bg: '#FEE8EB', color: '#E8112D' },
  { value: 'necesita', label: 'Se necesita', bg: '#EBF4FD', color: '#1F6FC4' },
  { value: 'no_necesita', label: 'Ya no necesita', bg: '#E9EEF3', color: '#8A98AB' },
]

export default function NecesidadesEditor({ categorias, necesidades, onChange }) {
  const getEstado = (catId) => necesidades?.[catId] || 'necesita'

  const setEstado = (catId, valor) => {
    onChange({ ...necesidades, [catId]: valor })
  }

  return (
    <div className="flex flex-col gap-3">
      {categorias.map((cat) => {
        const estado = getEstado(cat.id)
        return (
          <div key={cat.id}>
            <p className="text-xs font-semibold text-[#5A6B85] mb-1.5">{cat.label}</p>
            <div className="flex gap-2 flex-wrap">
              {ESTADOS.map((e) => (
                <button
                  key={e.value}
                  type="button"
                  onClick={() => setEstado(cat.id, e.value)}
                  className="px-3 py-1 rounded-full text-xs font-medium border-2 transition-all"
                  style={{
                    backgroundColor: estado === e.value ? e.bg : 'transparent',
                    color: estado === e.value ? e.color : '#8A98AB',
                    borderColor: estado === e.value ? e.color : '#E6EEF6',
                  }}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
