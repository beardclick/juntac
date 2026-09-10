'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function PurchasesList({ initialPurchases }) {
  const [filter, setFilter] = useState('TODOS')

  const filters = ['TODOS', 'ACTIVO', 'ADJUDICADO', 'EXPIRADO', 'DESIERTO']

  const filteredPurchases = filter === 'TODOS' 
    ? initialPurchases 
    : initialPurchases.filter(p => p.status.toUpperCase() === filter)

  const getBadgeClass = (status) => {
    switch(status.toUpperCase()) {
      case 'ACTIVO': return 'badge-activo'
      case 'ADJUDICADO': return 'badge-adjudicado'
      case 'EXPIRADO': return 'badge-expirado'
      case 'DESIERTO': return 'badge-desierto'
      default: return 'bg-gray-500 text-white'
    }
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors border ${
              filter === f 
                ? 'bg-[#254A39] text-white border-[#254A39]' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f === 'TODOS' ? 'Todos' : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* List */}
      {filteredPurchases.length === 0 ? (
        <div className="text-center text-gray-500 py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          No hay actos públicos que coincidan con el filtro seleccionado.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPurchases.map(purchase => (
            <Link href={`/transparencia/${purchase.slug}`} key={purchase.id} className="block group">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group-hover:shadow-md group-hover:border-[#254A39]/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-md ${getBadgeClass(purchase.status)}`}>
                    {purchase.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#254A39] transition-colors line-clamp-2">
                  {purchase.title}
                </h3>
                <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-600 gap-2">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    Publicación: {new Date(purchase.publication_date).toLocaleDateString('es-PA')}
                  </div>
                  <div className="flex items-center text-red-600 font-medium">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Cierre: {new Date(purchase.deadline_date).toLocaleDateString('es-PA')}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
