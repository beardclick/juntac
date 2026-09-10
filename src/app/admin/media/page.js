'use client'
import { useState, useEffect } from 'react'

export default function AdminMediaPage() {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/media')
      const data = await res.json()
      setMedia(data.media || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      try {
        const res = await fetch('/api/media', {
          method: 'POST',
          body: formData
        })
        const data = await res.json()
        if (res.ok && data.media) {
          setMedia(prev => [data.media, ...prev])
        }
      } catch (err) {
        console.error('Error uploading', file.name, err)
      }
    }
    setUploading(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este archivo de la mediateca?')) return
    try {
      const res = await fetch(`/api/media?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMedia(prev => prev.filter(m => String(m.id) !== String(id)))
      }
    } catch (e) {
      alert('Error al eliminar')
    }
  }

  const copyToClipboard = (url, id) => {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`
    navigator.clipboard.writeText(fullUrl)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredMedia = media.filter(m => {
    if (filterType === 'images') return m.mime_type?.startsWith('image') || m.filename?.match(/\.(jpg|jpeg|png|webp|svg)$/i)
    if (filterType === 'pdfs') return m.mime_type?.includes('pdf') || m.filename?.endsWith('.pdf')
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mediateca y Archivos</h2>
          <p className="text-sm text-gray-600 mt-1">
            Administra imágenes, documentos PDF de pliegos y material multimedia.
          </p>
        </div>

        <label className="cursor-pointer inline-flex items-center px-4 py-2.5 bg-[#254A39] hover:bg-[#1a3829] text-white font-semibold text-sm rounded-lg transition shadow-sm">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span>{uploading ? 'Subiendo archivos...' : 'Subir Archivos'}</span>
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            className="hidden"
            disabled={uploading}
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b pb-3">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            filterType === 'all' ? 'bg-[#254A39] text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Todos ({media.length})
        </button>
        <button
          onClick={() => setFilterType('images')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            filterType === 'images' ? 'bg-[#254A39] text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Imágenes
        </button>
        <button
          onClick={() => setFilterType('pdfs')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            filterType === 'pdfs' ? 'bg-[#254A39] text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          PDFs / Documentos
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border">
          Cargando archivos...
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border">
          No hay archivos subidos en esta categoría.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map((item) => {
            const isPdf = item.mime_type?.includes('pdf') || item.filename?.endsWith('.pdf')
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group"
              >
                <div className="h-32 bg-gray-50 flex items-center justify-center relative overflow-hidden border-b">
                  {isPdf ? (
                    <div className="flex flex-col items-center justify-center p-2 text-red-600">
                      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[10px] font-bold mt-1 text-gray-500">PDF</span>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.original_name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/images/hero.jpg' }}
                    />
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-white text-gray-800 rounded-lg hover:bg-gray-100 shadow"
                      title="Ver archivo"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <button
                      onClick={() => copyToClipboard(item.url, item.id)}
                      className="p-1.5 bg-white text-gray-800 rounded-lg hover:bg-gray-100 shadow"
                      title="Copiar URL"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow"
                      title="Eliminar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-2.5">
                  <p className="text-xs font-semibold text-gray-900 truncate" title={item.original_name}>
                    {item.original_name}
                  </p>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-gray-500">
                    <span>{item.size ? `${(item.size / 1024).toFixed(0)} KB` : ''}</span>
                    {copiedId === item.id && (
                      <span className="text-green-600 font-bold">¡Copiado!</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
