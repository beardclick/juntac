'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminNoticiasPage() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('todas')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/noticias')
      const data = await res.json()
      setNews(data.news || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`¿Estás seguro de eliminar la noticia "${title}"?`)) return

    try {
      const res = await fetch(`/api/noticias/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setNews(prev => prev.filter(n => String(n.id) !== String(id)))
      } else {
        alert('Error al eliminar noticia')
      }
    } catch (e) {
      alert('Error de conexión')
    }
  }

  const categories = Array.from(new Set(news.map(n => n.category || 'General')))

  const filteredNews = news.filter(n => {
    const matchesCat = categoryFilter === 'todas' || (n.category || 'General').toLowerCase() === categoryFilter.toLowerCase()
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          n.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Noticias</h2>
          <p className="text-sm text-gray-600 mt-1">
            Crea, edita y organiza las publicaciones y comunicados de la Junta Comunal.
          </p>
        </div>
        <Link
          href="/admin/noticias/nuevo"
          className="inline-flex items-center px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 shadow-sm transition"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Nueva Noticia
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => setCategoryFilter('todas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              categoryFilter === 'todas'
                ? 'bg-[#254A39] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                categoryFilter === cat
                  ? 'bg-[#254A39] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Buscar noticia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#254A39] outline-none"
          />
        </div>
      </div>

      {/* News Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Cargando noticias...</div>
        ) : filteredNews.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No se encontraron noticias con los filtros actuales.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-600">
                  <th className="px-6 py-3">Imagen</th>
                  <th className="px-6 py-3">Título / Noticia</th>
                  <th className="px-6 py-3">Categoría</th>
                  <th className="px-6 py-3">Fecha</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {filteredNews.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 w-20">
                      <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0 border">
                        <img
                          src={n.featured_image || '/images/hero.jpg'}
                          alt={n.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = '/images/hero.jpg' }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <p className="font-semibold text-gray-900 line-clamp-2">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{n.excerpt}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {n.category || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap text-xs">
                      {n.published_at || '-'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <Link
                        href={`/noticias/${n.slug}`}
                        target="_blank"
                        className="text-gray-600 hover:text-gray-900 px-2.5 py-1 text-xs font-medium border rounded hover:bg-gray-50"
                      >
                        Ver
                      </Link>
                      <Link
                        href={`/admin/noticias/${n.id}`}
                        className="text-emerald-700 hover:text-emerald-900 px-2.5 py-1 text-xs font-medium border border-emerald-300 rounded hover:bg-emerald-50"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(n.id, n.title)}
                        className="text-red-600 hover:text-red-800 px-2.5 py-1 text-xs font-medium border border-red-200 rounded hover:bg-red-50"
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
