'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteReportButton({ id }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar este reporte definitivamente?')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/reportes/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      } else {
        alert('Error al eliminar el reporte')
      }
    } catch (e) {
      alert('Error de conexión al eliminar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center text-red-600 hover:text-red-800 font-semibold text-xs disabled:opacity-50 transition"
    >
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      {loading ? 'Eliminando...' : 'Eliminar'}
    </button>
  )
}
