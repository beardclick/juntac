'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PurchaseForm({ initialData, isEdit = false }) {
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    status: initialData?.status || 'activo',
    publication_date: initialData?.publication_date || new Date().toISOString().split('T')[0],
    deadline_date: initialData?.deadline_date || '',
    documents: initialData?.documents || [
      {
        group: 'Pliego',
        files: [{ title: 'Ver Documento', url: '' }]
      }
    ]
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Handle basic input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const updated = { ...prev, [name]: value }
      if (name === 'title' && !isEdit) {
        updated.slug = value
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
      }
      return updated
    })
  }

  // Document Group Management
  const addDocumentGroup = () => {
    setFormData(prev => ({
      ...prev,
      documents: [
        ...prev.documents,
        {
          group: 'Nuevo Grupo',
          files: [{ title: 'Ver Documento', url: '' }]
        }
      ]
    }))
  }

  const removeDocumentGroup = (groupIndex) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== groupIndex)
    }))
  }

  const updateGroupName = (groupIndex, name) => {
    setFormData(prev => {
      const docs = [...prev.documents]
      docs[groupIndex].group = name
      return { ...prev, documents: docs }
    })
  }

  // File items inside group
  const addFileToGroup = (groupIndex) => {
    setFormData(prev => {
      const docs = [...prev.documents]
      const count = (docs[groupIndex].files?.length || 0) + 1
      docs[groupIndex].files = [
        ...(docs[groupIndex].files || []),
        { title: `Ver Documento ${count > 1 ? count : ''}`.trim(), url: '' }
      ]
      return { ...prev, documents: docs }
    })
  }

  const removeFileFromGroup = (groupIndex, fileIndex) => {
    setFormData(prev => {
      const docs = [...prev.documents]
      docs[groupIndex].files = docs[groupIndex].files.filter((_, i) => i !== fileIndex)
      return { ...prev, documents: docs }
    })
  }

  const updateFileField = (groupIndex, fileIndex, field, value) => {
    setFormData(prev => {
      const docs = [...prev.documents]
      docs[groupIndex].files[fileIndex][field] = value
      return { ...prev, documents: docs }
    })
  }

  // File Upload Helper
  const handleFileUpload = async (groupIndex, fileIndex, e) => {
    const file = e.target.files[0]
    if (!file) return

    const uploadForm = new FormData()
    uploadForm.append('file', file)

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: uploadForm
      })
      const data = await res.json()
      if (res.ok && data.url) {
        updateFileField(groupIndex, fileIndex, 'url', data.url)
        if (!formData.documents[groupIndex].files[fileIndex].title || formData.documents[groupIndex].files[fileIndex].title === 'Ver Documento') {
          updateFileField(groupIndex, fileIndex, 'title', file.name)
        }
      } else {
        alert(data.error || 'Error al subir archivo')
      }
    } catch (err) {
      alert('Error al subir el archivo PDF')
    }
  }

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const url = isEdit ? `/api/compras/${initialData.id}` : '/api/compras'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/admin/compras')
        router.refresh()
      } else {
        setError(data.error || 'Error al guardar la convocatoria')
      }
    } catch (err) {
      setError('Error de conexión con el servidor')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Main Info Card */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-4">
          Información General de la Convocatoria
        </h3>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Título de la Convocatoria / Proyecto *
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="Ej. Construcción de Casetas de Espera en el Corregimiento..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#254A39] outline-none text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Slug (URL amigable) *
          </label>
          <input
            type="text"
            name="slug"
            required
            value={formData.slug}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#254A39] outline-none text-gray-700 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Descripción Detallada *
          </label>
          <textarea
            name="description"
            rows="5"
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Detalles de la obra, ubicación (comunidades beneficiadas), fecha y lugar de recepción de propuestas..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#254A39] outline-none text-gray-900"
          ></textarea>
        </div>

        {/* Status and Dates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Estado de la Oferta *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#254A39] outline-none bg-white font-medium text-gray-800"
            >
              <option value="activo">🟢 Activo (Abierto a propuestas)</option>
              <option value="adjudicado">🔵 Adjudicado</option>
              <option value="expirado">🔴 Expirado (Cerrado por fecha)</option>
              <option value="desierto">🟠 Declarado Desierto</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              * El sistema cambia a Expirado automáticamente al pasar la fecha límite. "Declarado Desierto" puede seleccionarse manualmente.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fecha de Publicación Manual *
            </label>
            <input
              type="date"
              name="publication_date"
              required
              value={formData.publication_date}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#254A39] outline-none text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fecha Límite de Recepción *
            </label>
            <input
              type="date"
              name="deadline_date"
              required
              value={formData.deadline_date}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#254A39] outline-none text-gray-800"
            />
          </div>
        </div>
      </div>

      {/* PDF Documents Management Card */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Documentos Adjuntos (Pliegos, Cotizaciones, Órdenes)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Agrupa y administra los PDFs oficiales. Puedes editar el título, subir nuevos archivos o enlazar URLs existentes.
            </p>
          </div>
          <button
            type="button"
            onClick={addDocumentGroup}
            className="inline-flex items-center px-3 py-1.5 bg-[#254A39]/10 text-[#254A39] hover:bg-[#254A39]/20 font-semibold text-xs rounded-lg transition"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Agregar Grupo de Documentos
          </button>
        </div>

        {formData.documents.map((group, gIdx) => (
          <div key={gIdx} className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 w-full max-w-xs">
                <span className="text-xs font-bold text-gray-500 uppercase">Grupo:</span>
                <input
                  type="text"
                  value={group.group}
                  onChange={(e) => updateGroupName(gIdx, e.target.value)}
                  placeholder="Ej. Pliego, Cotización, Orden..."
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded font-semibold text-sm text-gray-900 focus:ring-2 focus:ring-[#254A39] outline-none w-full"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => addFileToGroup(gIdx)}
                  className="text-xs text-[#254A39] hover:underline font-semibold bg-white border px-2.5 py-1 rounded"
                >
                  + Agregar PDF
                </button>
                {formData.documents.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDocumentGroup(gIdx)}
                    className="text-xs text-red-600 hover:text-red-800 bg-white border border-red-200 px-2.5 py-1 rounded"
                  >
                    Eliminar Grupo
                  </button>
                )}
              </div>
            </div>

            {/* List of files in this group */}
            <div className="space-y-3 pt-2">
              {group.files?.map((file, fIdx) => (
                <div key={fIdx} className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col md:flex-row items-center gap-4">
                  <div className="w-full md:w-1/3">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Título del Documento *
                    </label>
                    <input
                      type="text"
                      value={file.title}
                      onChange={(e) => updateFileField(gIdx, fIdx, 'title', e.target.value)}
                      placeholder="Ej. Ver Documento, Pliego Definitivo..."
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#254A39] outline-none text-gray-900"
                    />
                  </div>

                  <div className="w-full md:w-1/2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      URL del Archivo PDF *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={file.url}
                        onChange={(e) => updateFileField(gIdx, fIdx, 'url', e.target.value)}
                        placeholder="https://... o sube un archivo"
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#254A39] outline-none text-gray-900"
                      />
                      <label className="cursor-pointer shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded border border-gray-300 flex items-center">
                        <span>Subir</span>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(gIdx, fIdx, e)}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex justify-end">
                    {group.files.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFileFromGroup(gIdx, fIdx)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50"
                        title="Eliminar este archivo"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end space-x-4">
        <Link
          href="/admin/compras"
          className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-[#254A39] hover:bg-[#1a3829] text-white font-bold rounded-lg transition shadow-md hover:shadow-lg disabled:opacity-50"
        >
          {saving ? 'Guardando Convocatoria...' : isEdit ? 'Actualizar Convocatoria' : 'Publicar Convocatoria'}
        </button>
      </div>
    </form>
  )
}
