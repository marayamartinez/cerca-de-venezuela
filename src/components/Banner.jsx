export default function Banner({ texto }) {
  if (!texto) return null
  return (
    <div className="w-full bg-[#EBF4FD] border-b border-[#C8DFF7] px-4 py-3 text-center">
      <p className="text-[#0B335E] text-sm font-medium leading-snug max-w-2xl mx-auto">
        {texto}
      </p>
    </div>
  )
}
