'use client'
import { useState, useEffect } from 'react'
import ReportFormSettings from '@/components/admin/ReportFormSettings'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ConfiguracionPage() {
  const [recipients, setRecipients] = useState([])
  const [form, setForm] = useState(null)
  const [newEmail, setNewEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/settings')
      .then(async (r) => { const data = await r.json(); if (!r.ok) throw new Error(data.error || 'No se pudo cargar la configuración.'); return data })
      .then((d) => { if (Array.isArray(d.recipients)) setRecipients(d.recipients); if (d.form) setForm(d.form) })
      .catch((error) => setMessage(error.message))
      .finally(() => setLoading(false))
  }, [])

  const addEmail = () => {
    const email = newEmail.trim()
    if (!email) return
    if (!EMAIL_RE.test(email)) {
      setMessage('⚠️ Correo inválido. Verifica el formato.')
      return
    }
    if (recipients.includes(email)) {
      setMessage('Ese correo ya está en la lista.')
      return
    }
    setRecipients((prev) => [...prev, email])
    setNewEmail('')
    setMessage('')
  }

  const removeEmail = (email) => {
    setRecipients((prev) => prev.filter((e) => e !== email))
  }

  const save = async () => {
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipients, form }),
      })
      const data = await res.json()
      if (res.ok) {
        setRecipients(data.recipients || [])
        if (data.form) setForm(data.form)
        setMessage('✅ Guardado correctamente.')
      } else {
        setMessage(data.error || 'Error al guardar.')
      }
    } catch (e) {
      setMessage('Error de conexión al guardar.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configuración</h2>
        <p className="text-sm text-gray-600 mt-1">
          Administra los correos que reciben los reportes ciudadanos enviados desde el formulario público.
        </p>
      </div>

      <ReportFormSettings value={form} onChange={setForm} />
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 max-w-2xl">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Correos destinatarios de reportes</h3>
        <p className="text-sm text-gray-500 mb-6">
          Cada reporte enviado llegará por email a todos los correos de esta lista.
        </p>

        {loading ? (
          <p className="text-gray-500 mb-6">Cargando...</p>
        ) : recipients.length === 0 ? (
          <p className="text-gray-500 mb-6">No hay correos configurados todavía.</p>
        ) : (
          <ul className="space-y-2 mb-6">
            {recipients.map((email) => (
              <li key={email} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5">
                <span className="text-gray-800 font-medium">{email}</span>
                <button
                  type="button"
                  onClick={() => removeEmail(email)}
                  className="text-red-600 hover:text-red-800 text-sm font-semibold"
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-2 mb-6">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addEmail() } }}
            placeholder="correo@ejemplo.com"
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#254A39] outline-none text-gray-900"
          />
          <button
            type="button"
            onClick={addEmail}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg border border-gray-300"
          >
            Agregar
          </button>
        </div>

        {message && <p className="text-sm font-medium text-gray-700 mb-4">{message}</p>}

        <button
          type="button"
          onClick={save}
          disabled={saving || loading || !form}
          className="px-6 py-2.5 bg-[#254A39] hover:bg-[#1a3829] text-white font-bold rounded-lg transition disabled:opacity-60"
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}
