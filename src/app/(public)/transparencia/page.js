import PageHeader from '@/components/PageHeader'
import PurchasesList from '@/components/PurchasesList'
import { getPurchases } from '@/lib/db'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Transparencia | Junta Comunal de David Sur',
  description: 'Actos públicos y contrataciones de la Junta Comunal de David Sur.',
}

export default async function TransparenciaPage() {
  const purchases = await getPurchases()

  return (
    <>
      <PageHeader title="Transparencia" breadcrumbs={[{ label: 'Transparencia', href: '/transparencia' }]} />
      
      <section className="py-20 bg-white min-h-screen">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Actos Públicos</h2>
          <PurchasesList initialPurchases={purchases} />
        </div>
      </section>
    </>
  )
}
