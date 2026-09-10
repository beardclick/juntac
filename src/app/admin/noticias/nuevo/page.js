import NewsForm from '@/components/admin/NewsForm'

export default function NuevaNoticiaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Crear Nueva Noticia</h2>
        <p className="text-sm text-gray-600 mt-1">
          Redacta y publica una nueva noticia para la comunidad de David Sur.
        </p>
      </div>

      <NewsForm />
    </div>
  )
}
