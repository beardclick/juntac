'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'

const STATUSES = ['ACTIVO', 'ADJUDICADO', 'EXPIRADO', 'DESIERTO']

// Same dual-badge behavior as the single (detail) view:
// adjudicado/desierto also show "EXPIRADO" because their reception deadline passed.
function getBadges(status) {
  const s = (status || '').toUpperCase()
  switch (s) {
    case 'ADJUDICADO':
      return [
        { label: 'EXPIRADO', cls: 'badge-expirado' },
        { label: 'ADJUDICADO', cls: 'badge-adjudicado' },
      ]
    case 'DESIERTO':
      return [
        { label: 'EXPIRADO', cls: 'badge-expirado' },
        { label: 'DECLARADO DESIERTO', cls: 'badge-desierto' },
      ]
    case 'ACTIVO':
      return [{ label: 'ACTIVO', cls: 'badge-activo' }]
    case 'EXPIRADO':
      return [{ label: 'EXPIRADO', cls: 'badge-expirado' }]
    default:
      return [{ label: s, cls: 'bg-gray-500 text-white' }]
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
                <span className="text-sm text-gray-700">{s === 'DESIERTO' ? 'DECLARADO DESIERTO' : s}</span>
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

      {/* Right: list (single column) */}
      <div className="lg:col-span-3">
        {filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            No hay actos públicos que coincidan con los filtros seleccionados.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filtered.map((purchase) => (
              <Link href={`/transparencia/${purchase.slug}`} key={purchase.id} className="block group">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group-hover:shadow-md group-hover:border-[#254A39]/30 transition-all">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {getBadges(purchase.status).map((b, i) => (
                      <span key={i} className={`text-xs font-bold px-3 py-1 rounded-md uppercase ${b.cls}`}>
                        {b.label}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-[#254A39] transition-colors">
                    {purchase.title}
                  </h3>

                  <div className="border-t border-gray-100 pt-4 space-y-1.5 text-sm text-gray-700">
                    <p>
                      <span className="font-bold text-gray-500 uppercase text-[11px]">Fecha de Publicación: </span>
                      {formatDate(purchase.publication_date)}
                    </p>
                    <p>
                      <span className="font-bold text-gray-500 uppercase text-[11px]">Fecha Límite Recepción de Propuestas: </span>
                      {formatDate(purchase.deadline_date)}
                    </p>
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
