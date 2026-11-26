'use client'
import { useState, useEffect } from 'react'
import Pagination from '@/components/Pagination'
import DeleteReportButton from '@/components/admin/DeleteReportButton'
import ReportDetailButton from '@/components/admin/ReportDetailButton'

const PAGE_SIZE = 10

export default function AdminReportesPage() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetch('/api/reportes')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d.reports)) setReports(d.reports) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const totalPages = Math.max(1, Math.ceil(reports.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedReports = reports.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Reportes Ciudadanos Recibidos</h2>
        <p className="text-sm text-gray-600 mt-1">
          Solicitudes e incidencias enviadas por los vecinos a través del formulario de la web.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Cargando reportes...</div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No se han recibido reportes ciudadanos todavía.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-600">
                    <th className="px-6 py-3">Fecha</th>
                    <th className="px-6 py-3">Ciudadano</th>
                    <th className="px-6 py-3">Cédula</th>
                    <th className="px-6 py-3">Contacto</th>
                    <th className="px-6 py-3">Tipo de Reporte</th>
                    <th className="px-6 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {paginatedReports.map((r) => (
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
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <ReportDetailButton report={r} />
                          <DeleteReportButton id={r.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} totalItems={reports.length} pageSize={PAGE_SIZE} />
          </>
        )}
      </div>
    </div>
  )
}
