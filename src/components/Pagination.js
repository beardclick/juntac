'use client'

export default function Pagination({ page, totalPages, onChange, totalItems, pageSize }) {
  if (!totalPages || totalPages <= 1) return null

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  // Window of up to 5 page buttons around the current page
  const pages = []
  const maxButtons = 5
  let from = Math.max(1, page - Math.floor(maxButtons / 2))
  let to = Math.min(totalPages, from + maxButtons - 1)
  from = Math.max(1, to - maxButtons + 1)
  for (let n = from; n <= to; n++) pages.push(n)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
      <p className="text-sm text-gray-600">
        Mostrando {start}–{end} de {totalItems}
      </p>
      <div className="flex items-center gap-1 flex-wrap">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-300 bg-white disabled:opacity-40 hover:bg-gray-50 transition"
        >
          Anterior
        </button>

        {from > 1 && <span className="px-1 text-gray-400">…</span>}

        {pages.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`px-3 py-1.5 text-sm font-semibold rounded-lg border transition ${
              n === page
                ? 'bg-[#254A39] text-white border-[#254A39]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {n}
          </button>
        ))}

        {to < totalPages && <span className="px-1 text-gray-400">…</span>}

        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-300 bg-white disabled:opacity-40 hover:bg-gray-50 transition"
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
