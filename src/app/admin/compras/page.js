'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminComprasPage() {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('todos')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPurchases()
  }, [])

  const fetchPurchases = async () => {
    try {
      const res = await fetch('/api/compras')
      const data = await res.json()
      setPurchases(data.purchases || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`¿Estás seguro de eliminar el acto público "${title}"?`)) return

    try {
      const res = await fetch(`/api/compras/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPurchases(prev => prev.filter(p => String(p.id) !== String(id)))
      } else {
        alert('Error al eliminar')
      }
    } catch (e) {
      alert('Error de conexión')
    }
  }

  const filteredPurchases = purchases.filter(p => {
    const matchesFilter = filter === 'todos' || p.status.toLowerCase() === filter.toLowerCase()
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transparencia: Actos Públicos y Compras</h2>
          <p className="text-sm text-gray-600 mt-1">
            Administra las convocatorias públicas, sube pliegos en PDF, cotizaciones y órdenes de proceder.
          </p>
        </div>
        <Link
          href="/admin/compras/nuevo"
          className="inline-flex items-center px-4 py-2.5 bg-[#254A39] text-white text-sm font-semibold rounded-lg hover:bg-[#1a3829] shadow-sm transition"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Nueva Convocatoria
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {['todos', 'activo', 'adjudicado', 'expirado', 'desierto'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                filter === st
                  ? 'bg-[#254A39] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {st === 'desierto' ? 'Declarado Desierto' : st}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Buscar compra..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#254A39] outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Cargando actos públicos...</div>
        ) : filteredPurchases.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No se encontraron actos públicos con el filtro actual.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-600">
                  <th className="px-6 py-3">Título / Convocatoria</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3">Publicación</th>
                  <th className="px-6 py-3">Fecha Límite</th>
                  <th className="px-6 py-3">Documentos</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {filteredPurchases.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 max-w-md">
                      <p className="font-semibold text-gray-900 line-clamp-2">{p.title}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{p.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                        p.status === 'activo' ? 'bg-green-100 text-green-800' :
                        p.status === 'adjudicado' ? 'bg-blue-100 text-blue-800' :
                        p.status === 'desierto' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {p.status === 'desierto' ? 'Declarado Desierto' : p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {p.publication_date || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {p.deadline_date || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="inline-flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                        📄 {p.documents?.reduce((acc, g) => acc + (g.files?.length || 0), 0) || 0} PDFs
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <Link
                        href={`/transparencia/${p.slug}`}
                        target="_blank"
                        className="text-gray-600 hover:text-gray-900 px-2 py-1 text-xs font-medium border rounded hover:bg-gray-50"
                      >
                        Ver
                      </Link>
                      <Link
                        href={`/admin/compras/${p.id}`}
                        className="text-[#254A39] hover:text-[#1a3829] px-2 py-1 text-xs font-medium border border-[#254A39]/30 rounded hover:bg-[#254A39]/5"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="text-red-600 hover:text-red-800 px-2 py-1 text-xs font-medium border border-red-200 rounded hover:bg-red-50"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
