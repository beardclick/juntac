import NewsForm from '@/components/admin/NewsForm'
import { getNews } from '@/lib/db'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditarNoticiaPage({ params }) {
  const { id } = await params
  const { news } = await getNews({ limit: 100 })
  const noticia = news.find(n => String(n.id) === String(id))

  if (!noticia) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Editar Noticia</h2>
        <p className="text-sm text-gray-600 mt-1">
          Modifica el contenido, fecha, categoría o imágenes de la publicación.
        </p>
      </div>

      <NewsForm initialData={noticia} isEdit={true} />
    </div>
  )
}
