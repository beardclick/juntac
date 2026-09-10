import PurchaseForm from '@/components/admin/PurchaseForm'

export default function NuevaCompraPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Nueva Convocatoria / Compra Pública</h2>
        <p className="text-sm text-gray-600 mt-1">
          Crea una nueva oferta o licitación pública para la comunidad de David Sur.
        </p>
      </div>

      <PurchaseForm />
    </div>
  )
}
