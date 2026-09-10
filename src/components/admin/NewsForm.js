'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewsForm({ initialData, isEdit = false }) {
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    category: initialData?.category || 'Gestión',
    published_at: initialData?.published_at ? initialData.published_at.split('T')[0] : new Date().toISOString().split('T')[0],
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    featured_image: initialData?.featured_image || '',
    gallery: initialData?.gallery || []
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [newGalleryUrl, setNewGalleryUrl] = useState('')

  const categories = ['Gestión', 'Actividades', 'Transparencia', 'Infraestructura', 'Cultura', 'Medio Ambiente']

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

  const handleFeaturedImageUpload = async (e) => {
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
        setFormData(prev => ({ ...prev, featured_image: data.url }))
      } else {
        alert(data.error || 'Error al subir imagen')
      }
    } catch (err) {
      alert('Error de conexión al subir imagen')
    }
  }

  const handleAddGalleryImage = () => {
    if (!newGalleryUrl.trim()) return
    setFormData(prev => ({
      ...prev,
      gallery: [...prev.gallery, newGalleryUrl.trim()]
    }))
    setNewGalleryUrl('')
  }

  const handleRemoveGalleryImage = (idx) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== idx)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const url = isEdit ? `/api/noticias/${initialData.id}` : '/api/noticias'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/admin/noticias')
        router.refresh()
      } else {
        setError(data.error || 'Error al guardar la noticia')
      }
    } catch (err) {
      setError('Error de conexión')
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

      {/* Main Info */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-4">
          Detalles de la Publicación
        </h3>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Título de la Noticia *
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="Título informativo..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 outline-none text-gray-900"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Slug (URL) *
            </label>
            <input
              type="text"
              name="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-emerald-600 outline-none text-gray-700 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-gray-800"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Fecha de Publicación *
          </label>
          <input
            type="date"
            name="published_at"
            required
            value={formData.published_at}
            onChange={handleChange}
            className="w-full md:w-64 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 outline-none text-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Resumen / Extracto (aparece en listados) *
          </label>
          <textarea
            name="excerpt"
            rows="2"
            required
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Breve resumen de 1 a 2 oraciones..."
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 outline-none text-gray-900"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Contenido Completo de la Noticia *
          </label>
          <textarea
            name="content"
            rows="8"
            required
            value={formData.content}
            onChange={handleChange}
            placeholder="Escribe el texto completo de la noticia..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 outline-none text-gray-900"
          ></textarea>
        </div>
      </div>

      {/* Featured Image & Gallery */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-4">
          Imágenes y Galería
        </h3>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Imagen Destacada (URL o Subir archivo)
          </label>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex-1 w-full flex gap-2">
              <input
                type="text"
                name="featured_image"
                value={formData.featured_image}
                onChange={handleChange}
                placeholder="https://... o /images/hero.jpg"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 outline-none text-gray-900"
              />
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg border border-gray-300 font-semibold text-sm flex items-center shrink-0">
                <span>Subir</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFeaturedImageUpload}
                />
              </label>
            </div>

            {formData.featured_image && (
              <div className="w-24 h-24 rounded-lg overflow-hidden border bg-gray-100 shrink-0">
                <img
                  src={formData.featured_image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Gallery */}
        <div className="border-t pt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Galería de Imágenes Adicionales
          </label>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newGalleryUrl}
              onChange={(e) => setNewGalleryUrl(e.target.value)}
              placeholder="URL de imagen para agregar a la galería..."
              className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
            />
            <button
              type="button"
              onClick={handleAddGalleryImage}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg"
            >
              Agregar a Galería
            </button>
          </div>

          {formData.gallery.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {formData.gallery.map((imgUrl, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden border bg-gray-100 aspect-square">
                  <img src={imgUrl} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(i)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end space-x-4">
        <Link
          href="/admin/noticias"
          className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition shadow-md hover:shadow-lg disabled:opacity-50"
        >
          {saving ? 'Guardando...' : isEdit ? 'Actualizar Noticia' : 'Publicar Noticia'}
        </button>
      </div>
    </form>
  )
}
