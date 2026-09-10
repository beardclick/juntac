import PurchaseForm from '@/components/admin/PurchaseForm'
import { getPurchases } from '@/lib/db'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditarCompraPage({ params }) {
  const { id } = params
  const purchases = await getPurchases()
  const purchase = purchases.find(p => String(p.id) === String(id))

  if (!purchase) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Editar Convocatoria / Compra Pública</h2>
        <p className="text-sm text-gray-600 mt-1">
          Modifica los detalles, fechas o documentos de la convocatoria.
        </p>
      </div>

      <PurchaseForm initialData={purchase} isEdit={true} />
    </div>
  )
}
