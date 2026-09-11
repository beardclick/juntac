import PageHeader from '@/components/PageHeader'
import Link from 'next/link'
import { getPurchaseBySlug, getPurchases } from '@/lib/db'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const purchase = await getPurchaseBySlug(slug)
  if (!purchase) return { title: 'Acto Público | Junta Comunal David Sur' }
  return {
    title: `${purchase.title} | Junta Comunal de David Sur`,
    description: purchase.description?.slice(0, 160)
  }
}

export default async function PurchaseDetailPage({ params }) {
  const { slug } = await params
  const purchase = await getPurchaseBySlug(slug)

  if (!purchase) {
    notFound()
  }

  const getBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'activo': return 'bg-green-600 text-white'
      case 'adjudicado': return 'bg-blue-600 text-white'
      case 'expirado': return 'bg-red-600 text-white'
      case 'desierto': return 'bg-amber-600 text-white'
      default: return 'bg-gray-600 text-white'
    }
  }

  const shareUrl = `https://jcdavidsur.gob.pa/transparencia/${slug}`

  // Format dates
  const formatDisplayDate = (d) => {
    if (!d) return '-'
    try {
      const parts = d.split('-')
      if (parts.length === 3) {
        const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
        const monthIndex = parseInt(parts[1], 10) - 1
        return `${months[monthIndex]} ${parseInt(parts[2], 10)}, ${parts[0]}`
      }
      return d
    } catch (e) {
      return d
    }
  }

  return (
    <>
      <PageHeader 
        title="Detalle del Acto" 
        breadcrumbs={[
          { label: 'Transparencia', href: '/transparencia' },
          { label: 'Detalle', href: '#' }
        ]} 
      />

      <section className="py-20 bg-white min-h-screen">
        <div className="container mx-auto px-6 max-w-4xl">
          
          <Link href="/transparencia" className="inline-flex items-center text-[#254A39] font-semibold hover:underline mb-8">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Volver a Actos Públicos
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10">
            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {purchase.status === 'adjudicado' && (
                <>
                  <span className="text-xs font-bold uppercase px-3 py-1 rounded bg-red-600 text-white">
                    EXPIRADO
                  </span>
                  <span className="text-xs font-bold uppercase px-3 py-1 rounded bg-blue-600 text-white">
                    ADJUDICADO
                  </span>
                </>
              )}
              {purchase.status === 'desierto' && (
                <>
                  <span className="text-xs font-bold uppercase px-3 py-1 rounded bg-red-600 text-white">
                    EXPIRADO
                  </span>
                  <span className="text-xs font-bold uppercase px-3 py-1 rounded bg-amber-600 text-white">
                    Declarado Desierto
                  </span>
                </>
              )}
              {purchase.status === 'activo' && (
                <span className="text-xs font-bold uppercase px-3 py-1 rounded bg-green-600 text-white">
                  ACTIVO
                </span>
              )}
              {purchase.status === 'expirado' && (
                <span className="text-xs font-bold uppercase px-3 py-1 rounded bg-red-600 text-white">
                  EXPIRADO
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-snug">
              {purchase.title}
            </h1>

            {/* Social Share Buttons */}
            <div className="border-y border-gray-200 py-3 mb-8 flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-700">
              <span className="text-gray-500 uppercase tracking-wider">Compartir:</span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#1877F2] transition flex items-center space-x-1"
              >
                <span>Facebook</span>
              </a>
              <span className="text-gray-300">•</span>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(purchase.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition flex items-center space-x-1"
              >
                <span>X</span>
              </a>
              <span className="text-gray-300">•</span>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#0A66C2] transition flex items-center space-x-1"
              >
                <span>LinkedIn</span>
              </a>
              <span className="text-gray-300">•</span>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(purchase.title + ' ' + shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#25D366] transition flex items-center space-x-1"
              >
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Descripción:</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-justify">
                {purchase.description}
              </p>
            </div>

            {/* Dates */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100 space-y-3">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Fecha de Publicación:</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">
                  {formatDisplayDate(purchase.publication_date)}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Fecha Límite Recepción de Propuestas:</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">
                  {formatDisplayDate(purchase.deadline_date)}
                </p>
              </div>
            </div>

            {/* Documents */}
            {purchase.documents && purchase.documents.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Documentos:</h3>
                
                {purchase.documents.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-2">
                    <h4 className="font-bold text-sm text-[#254A39]">{group.group}:</h4>
                    <div className="flex flex-wrap gap-3">
                      {group.files?.map((file, fIdx) => (
                        <a
                          key={fIdx}
                          href={file.url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-[#254A39] hover:underline font-semibold bg-gray-50 hover:bg-[#254A39]/10 px-3 py-1.5 rounded-md border border-gray-200 transition"
                        >
                          <svg className="w-4 h-4 mr-1.5 text-red-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                          <span>{file.title || 'Ver Documento'}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </section>
    </>
  )
}
