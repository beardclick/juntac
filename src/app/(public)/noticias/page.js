import PageHeader from '@/components/PageHeader'
import NewsCard from '@/components/NewsCard'
import { getNews } from '@/lib/db'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Noticias | Junta Comunal de David Sur',
  description: 'Últimas noticias y comunicados del corregimiento de David Sur.',
}

export default async function NoticiasPage({ searchParams }) {
  const sp = await searchParams
  const page = parseInt(sp.page || '1')
  const limit = 9
  const { news: noticias, total } = await getNews({ page, limit })
  const totalPages = Math.ceil(total / limit)

  return (
    <>
      <PageHeader title="Noticias" breadcrumbs={[{ label: 'Noticias', href: '/noticias' }]} />

      <section className="py-20 bg-white min-h-screen">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {noticias.map((noticia) => (
              <NewsCard 
                key={noticia.id}
                title={noticia.title}
                slug={noticia.slug}
                excerpt={noticia.excerpt}
                featured_image={noticia.featured_image}
                category={noticia.category || 'General'}
                published_at={noticia.published_at}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4">
              {page > 1 ? (
                <a
                  href={`/noticias?page=${page - 1}`}
                  className="px-6 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Anterior
                </a>
              ) : (
                <span className="px-6 py-2 bg-gray-100 border border-gray-200 rounded-lg font-semibold text-gray-400 cursor-not-allowed">
                  Anterior
                </span>
              )}

              <span className="text-sm font-medium text-gray-600">
                Página {page} de {totalPages}
              </span>

              {page < totalPages ? (
                <a
                  href={`/noticias?page=${page + 1}`}
                  className="px-6 py-2 bg-[#254A39] text-white rounded-lg font-semibold hover:bg-[#1a3829] transition"
                >
                  Siguiente
                </a>
              ) : (
                <span className="px-6 py-2 bg-gray-100 border border-gray-200 rounded-lg font-semibold text-gray-400 cursor-not-allowed">
                  Siguiente
                </span>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
