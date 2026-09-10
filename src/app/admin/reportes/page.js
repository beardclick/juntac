import { getReports } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AdminReportesPage() {
  const reports = await getReports()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Reportes Ciudadanos Recibidos</h2>
        <p className="text-sm text-gray-600 mt-1">
          Solicitudes e incidencias enviadas por los vecinos a través del formulario de la web.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {reports.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No se han recibido reportes ciudadanos todavía.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-600">
                  <th className="px-6 py-3">Fecha</th>
                  <th className="px-6 py-3">Ciudadano</th>
                  <th className="px-6 py-3">Cédula</th>
                  <th className="px-6 py-3">Contacto</th>
                  <th className="px-6 py-3">Tipo de Reporte</th>
                  <th className="px-6 py-3">Detalles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(r.created_at).toLocaleDateString('es-PA')}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {r.nombre} {r.apellido}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                      {r.cedula}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      <div>{r.email}</div>
                      {r.telefono && <div className="text-gray-500">{r.telefono}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {r.tipo_reporte}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600 max-w-xs">
                      {r.detalle_parcheo || r.detalles || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
