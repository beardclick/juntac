import PageHeader from '@/components/PageHeader'
import GalleryLightbox from '@/components/GalleryLightbox'
import Link from 'next/link'
import { getNewsBySlug, getNews } from '@/lib/db'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

function toPlainText(value = '') {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export async function generateMetadata({ params }) {
  const { slug } = params
  const noticia = await getNewsBySlug(slug)
  if (!noticia) return { title: 'Noticia | Junta Comunal David Sur' }
  return {
    title: `${noticia.title} | Junta Comunal de David Sur`,
    description: noticia.excerpt || toPlainText(noticia.content).slice(0, 160)
  }
}

export default async function NoticiaDetailPage({ params }) {
  const { slug } = params
  const noticia = await getNewsBySlug(slug)

  if (!noticia) {
    notFound()
  }

  const { news: recentNews } = await getNews({ limit: 4 })
  const otherNews = recentNews.filter(n => n.slug !== slug).slice(0, 3)

  return (
    <>
      <PageHeader 
        title="Noticias" 
        breadcrumbs={[
          { label: 'Noticias', href: '/noticias' },
          { label: noticia.title, href: '#' }
        ]} 
      />

      <article className="py-20 bg-white min-h-screen">
        <div className="container mx-auto px-6 max-w-4xl">
          
          <Link href="/noticias" className="inline-flex items-center text-[#254A39] font-semibold hover:underline mb-8">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Volver a Noticias
          </Link>

          {/* Featured Image */}
          {noticia.featured_image && (
            <div className="rounded-2xl overflow-hidden shadow-lg mb-8 max-h-[500px] w-full bg-gray-100">
              <img 
                src={noticia.featured_image} 
                alt={noticia.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase">
              {noticia.category || 'General'}
            </span>
            <span className="text-gray-500 text-sm flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              {noticia.published_at || 'Reciente'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            {noticia.title}
          </h1>

          {/* Content */}
          <div
            className="wordpress-content prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: noticia.content }}
          />

          {/* Gallery if present */}
          {noticia.gallery && noticia.gallery.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Galería de Fotos</h3>
              <GalleryLightbox images={noticia.gallery} />
            </div>
          )}

          {/* Other recent news */}
          {otherNews.length > 0 && (
            <div className="mt-16 pt-12 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Otras Noticias de Interés</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {otherNews.map(item => (
                  <Link key={item.id} href={`/noticias/${item.slug}`} className="group block bg-gray-50 rounded-xl p-4 border hover:border-[#254A39]/30 transition">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">{item.category}</span>
                    <h4 className="text-sm font-bold text-gray-900 mt-1 line-clamp-2 group-hover:text-[#254A39] transition">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-2">{item.published_at}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </article>
    </>
  )
}
