'use client'
import { useState } from 'react'

function autoLink(text) {
  return text.split(/(https?:\/\/[^\s]+)/g).map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#254A39] underline break-all hover:text-[#1a3829]"
        >
          {part}
        </a>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export default function ReportDetailButton({ report }) {
  const [open, setOpen] = useState(false)

  const detalles = (report.detalle_parcheo || report.detalles || '').toString()

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center text-[#254A39] hover:underline font-semibold text-xs"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Ver
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-gray-900">Detalle del Reporte</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-800"
                aria-label="Cerrar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 space-y-3 text-sm text-gray-700">
              <p><strong>Ciudadano:</strong> {report.nombre} {report.apellido}</p>
              <p><strong>Cédula:</strong> {report.cedula}</p>
              <p><strong>Email:</strong> {report.email}</p>
              {report.telefono && <p><strong>Teléfono:</strong> {report.telefono}</p>}
              <p>
                <strong>Tipo de Reporte:</strong>{' '}
                <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {report.tipo_reporte}
                </span>
              </p>
              <p><strong>Fecha:</strong> {new Date(report.created_at).toLocaleString('es-PA')}</p>

              {detalles && (
                <div className="pt-3 border-t border-gray-100">
                  <strong>Detalles:</strong>
                  <div className="mt-2 space-y-1.5 break-words">
                    {detalles.split('\n').filter(Boolean).map((line, i) => (
                      <p key={i}>{autoLink(line)}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
