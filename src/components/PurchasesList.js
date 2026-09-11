'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'

const STATUSES = ['ACTIVO', 'ADJUDICADO', 'EXPIRADO', 'DESIERTO']

function statusLabel(status) {
  switch ((status || '').toUpperCase()) {
    case 'ACTIVO': return 'ACTIVO'
    case 'ADJUDICADO': return 'ADJUDICADO'
    case 'EXPIRADO': return 'EXPIRADO'
    case 'DESIERTO': return 'DECLARADO DESIERTO'
    default: return (status || '').toUpperCase()
  }
}

function badgeClass(status) {
  switch ((status || '').toUpperCase()) {
    case 'ACTIVO': return 'badge-activo'
    case 'ADJUDICADO': return 'badge-adjudicado'
    case 'EXPIRADO': return 'badge-expirado'
    case 'DESIERTO': return 'badge-desierto'
    default: return 'bg-gray-500 text-white'
  }
}

function formatDate(d) {
  if (!d) return '-'
  const date = new Date(d)
  if (isNaN(date.getTime())) return d
  return date.toLocaleDateString('es-PA', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function PurchasesList({ initialPurchases }) {
  const [selected, setSelected] = useState([])
  const [sortBy, setSortBy] = useState('publication_desc')

  const toggleStatus = (s) => {
    setSelected((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    )
  }

  const filtered = useMemo(() => {
    let list = initialPurchases || []
    if (selected.length > 0) {
      list = list.filter((p) => selected.includes((p.status || '').toUpperCase()))
    }
    return [...list].sort((a, b) => {
      switch (sortBy) {
        case 'publication_asc':
          return new Date(a.publication_date) - new Date(b.publication_date)
        case 'deadline_desc':
          return new Date(b.deadline_date) - new Date(a.deadline_date)
        case 'deadline_asc':
          return new Date(a.deadline_date) - new Date(b.deadline_date)
        case 'publication_desc':
        default:
          return new Date(b.publication_date) - new Date(a.publication_date)
      }
    })
  }, [initialPurchases, selected, sortBy])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left sidebar: filters + sort */}
      <aside className="lg:col-span-1">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:sticky lg:top-24">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Estado</h3>
          <div className="space-y-3">
            {STATUSES.map((s) => (
              <label key={s} className="flex items-center space-x-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selected.includes(s)}
                  onChange={() => toggleStatus(s)}
                  className="w-4 h-4 rounded accent-[#254A39]"
                />
                <span className="text-sm text-gray-700">{statusLabel(s)}</span>
              </label>
            ))}
          </div>

          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mt-8 mb-4">Ordenar por fecha</h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#254A39] outline-none bg-white text-gray-800"
          >
            <option value="publication_desc">Publicados (recientes primero)</option>
            <option value="publication_asc">Publicados (antiguos primero)</option>
            <option value="deadline_desc">Cierre (recientes primero)</option>
            <option value="deadline_asc">Cierre (antiguos primero)</option>
          </select>

          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => setSelected([])}
              className="mt-6 w-full text-xs font-semibold text-[#254A39] hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </aside>

      {/* Right: list */}
      <div className="lg:col-span-3">
        {filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            No hay actos públicos que coincidan con los filtros seleccionados.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filtered.map((purchase) => (
              <Link href={`/transparencia/${purchase.slug}`} key={purchase.id} className="block group">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group-hover:shadow-md group-hover:border-[#254A39]/30 transition-all h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-md uppercase ${badgeClass(purchase.status)}`}>
                      {statusLabel(purchase.status)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-[#254A39] transition-colors line-clamp-2">
                    {purchase.title}
                  </h3>
                  <div className="mt-auto space-y-2 text-sm border-t border-gray-100 pt-4">
                    <div className="flex items-start gap-2">
                      <span className="text-[11px] font-bold text-gray-500 uppercase shrink-0 w-28">Fecha de Publicación</span>
                      <span className="text-gray-700">{formatDate(purchase.publication_date)}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[11px] font-bold text-gray-500 uppercase shrink-0 w-28">Fecha Límite Recepción de Propuestas</span>
                      <span className="text-gray-700">{formatDate(purchase.deadline_date)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
