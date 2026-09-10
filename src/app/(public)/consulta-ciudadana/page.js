import PageHeader from '@/components/PageHeader'

export const metadata = {
  title: 'Consulta Ciudadana | Junta Comunal de David Sur',
  description: 'Mecanismos de participación ciudadana e inversión comunitaria en David Sur.',
}

export default function ConsultaCiudadanaPage() {
  const proyectos = [
    { nombre: 'Suministro Para Mantenimiento de calles', monto: 'B/. 20,000.00' },
    { nombre: 'Ayuda Social', monto: 'B/. 6,230.00' },
    { nombre: 'Aceras', monto: 'B/. 20,000.00' },
    { nombre: 'Casetas', monto: 'B/. 20,000.00' },
    { nombre: 'Equipamiento Comunitario', monto: 'B/. 10,000.00' }
  ]

  return (
    <>
      <PageHeader title="Consulta Ciudadana" breadcrumbs={[{ label: 'Consulta Ciudadana', href: '/consulta-ciudadana' }]} />

      <section className="py-20 bg-white min-h-screen">
        <div className="container mx-auto px-6 max-w-6xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Text & Quote */}
            <div className="lg:col-span-6 space-y-6">
              <blockquote className="text-2xl sm:text-3xl font-bold text-[#254A39] leading-snug border-l-4 border-[#254A39] pl-6 italic">
                “La voz de los vecinos construye nuestro futuro”
              </blockquote>

              <div className="text-gray-700 leading-relaxed text-justify space-y-4 text-base md:text-lg">
                <p>
                  La Consulta Ciudadana es un espacio de participación transparente y abierta, donde cada vecino tiene la oportunidad de expresar su opinión y aportar ideas para el desarrollo de nuestra comunidad.
                </p>
                <p>
                  Aquí encontrarás información sobre los proyectos que han sido discutidos y aprobados a través de este mecanismo, incluyendo su descripción, inversión, estado de ejecución y el impacto que generan en nuestro corregimiento.
                </p>
              </div>

              {/* Total Card */}
              <div className="bg-[#254A39]/5 border border-[#254A39]/20 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#254A39] uppercase tracking-wider">Inversión Aprobada Total</p>
                  <p className="text-3xl sm:text-4xl font-bold text-[#254A39] mt-1">B/. 76,230.00</p>
                </div>
                <div className="w-14 h-14 rounded-xl bg-[#254A39] text-white flex items-center justify-center">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right Column: Exact Table */}
            <div className="lg:col-span-6 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-[#254A39] px-6 py-4">
                <h3 className="text-lg font-bold text-white text-center tracking-wide">
                  PROYECTOS APROBADOS EN CONSULTA CIUDADANA
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-bold text-gray-700">
                      <th className="px-6 py-4">NOMBRE DEL PROYECTO</th>
                      <th className="px-6 py-4 text-right">MONTO APROBADO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {proyectos.map((p, i) => (
                      <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4 text-gray-900 font-semibold">{p.nombre}</td>
                        <td className="px-6 py-4 text-right text-gray-800 font-mono font-bold whitespace-nowrap">{p.monto}</td>
                      </tr>
                    ))}
                    {/* Total Row */}
                    <tr className="bg-gray-50 font-bold text-base border-t-2 border-gray-200">
                      <td className="px-6 py-4 text-gray-900">TOTAL:</td>
                      <td className="px-6 py-4 text-right text-[#254A39] font-mono">B/. 76,230.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
