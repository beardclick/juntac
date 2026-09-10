import Link from 'next/link'
import { getNews, getPurchases, getReports, getMedia } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [{ total: totalNews, news }, purchases, reports, media] = await Promise.all([
    getNews({ limit: 5 }),
    getPurchases(),
    getReports(),
    getMedia()
  ])

  const activePurchases = purchases.filter(p => p.status === 'activo')
  const adjudicadoPurchases = purchases.filter(p => p.status === 'adjudicado')
  const expiradoPurchases = purchases.filter(p => p.status === 'expirado')

  const statCards = [
    {
      title: 'Noticias Publicadas',
      value: totalNews,
      href: '/admin/noticias',
      color: 'bg-emerald-500',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    },
    {
      title: 'Actos / Compras',
      value: purchases.length,
      subtitle: `${activePurchases.length} activas`,
      href: '/admin/compras',
      color: 'bg-[#254A39]',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: 'Reportes Ciudadanos',
      value: reports.length,
      href: '/admin/reportes',
      color: 'bg-blue-600',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      title: 'Archivos en Mediateca',
      value: media.length,
      href: '/admin/media',
      color: 'bg-purple-600',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bienvenido al Panel de Control</h2>
          <p className="text-sm text-gray-600 mt-1">
            Administra los contenidos, noticias, actos de compras y reportes ciudadanos de la Junta Comunal de David Sur.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/compras/nuevo"
            className="inline-flex items-center px-4 py-2 bg-[#254A39] text-white text-sm font-semibold rounded-lg hover:bg-[#1a3829] shadow-sm transition"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Nueva Compra / Acto
          </Link>
          <Link
            href="/admin/noticias/nuevo"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 shadow-sm transition"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Nueva Noticia
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Link
            key={i}
            href={stat.href}
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              {stat.subtitle && (
                <p className="text-xs font-semibold text-emerald-600 mt-1">{stat.subtitle}</p>
              )}
            </div>
            <div className={`p-4 rounded-xl ${stat.color}`}>
              {stat.icon}
            </div>
          </Link>
        ))}
      </div>

      {/* Grid for Recent Purchases & News */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Purchases */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Actos Públicos Recientes</h3>
            <Link href="/admin/compras" className="text-sm font-semibold text-[#254A39] hover:underline">
              Ver todos ({purchases.length})
            </Link>
          </div>

          <div className="space-y-4">
            {purchases.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition">
                <div className="pr-4">
                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">{p.title}</h4>
                  <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                    <span>Límite: {p.deadline_date || 'Sin fecha'}</span>
                    <span>•</span>
                    <span>{p.documents?.length || 0} grupos de docs</span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                    p.status === 'activo' ? 'bg-green-100 text-green-800' :
                    p.status === 'adjudicado' ? 'bg-blue-100 text-blue-800' :
                    p.status === 'desierto' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {p.status}
                  </span>
                  <Link
                    href={`/admin/compras/${p.id}`}
                    className="text-xs text-[#254A39] font-medium hover:underline"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent News */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Últimas Noticias</h3>
            <Link href="/admin/noticias" className="text-sm font-semibold text-[#254A39] hover:underline">
              Ver todas ({totalNews})
            </Link>
          </div>

          <div className="space-y-4">
            {news.slice(0, 4).map((n) => (
              <div key={n.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition">
                <div className="pr-4">
                  <span className="text-[11px] font-semibold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                    {n.category}
                  </span>
                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mt-1">{n.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{n.published_at}</p>
                </div>
                <Link
                  href={`/admin/noticias/${n.id}`}
                  className="text-xs text-[#254A39] font-medium hover:underline shrink-0"
                >
                  Editar
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
