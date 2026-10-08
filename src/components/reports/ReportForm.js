'use client'
import { useState, useRef, useEffect } from 'react'
import PageHeader from '@/components/PageHeader'
import { defaultReportForm } from '@/lib/report-form'

const inputClass = "w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#254A39] outline-none text-gray-900"
const labelClass = "block text-sm font-semibold text-gray-700 mb-2"

// Compress an image in the browser (resize + JPEG) before uploading.
function compressImage(file, maxDim = 1600, quality = 0.8) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      try {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' }))
          } else {
            resolve(file)
          }
        }, 'image/jpeg', quality)
      } catch (e) {
        resolve(file)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(file)
    }
    img.src = url
  })
}

export default function ReportesPage({ config = defaultReportForm }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    email: '',
    telefono: '',
    tipo_reporte: '',
    direccion: '',
    google_maps: '',
    seguimiento: '',
    especificar: '',
  })
  const [fotos, setFotos] = useState([])
  const [previews, setPreviews] = useState([])
  useEffect(() => {
    const urls = fotos.map(file => URL.createObjectURL(file))
    setPreviews(urls)
    return () => urls.forEach(url => URL.revokeObjectURL(url))
  }, [fotos])
  const [dragOver, setDragOver] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileRef = useRef(null)

  const fields = config.options.find(option => option.label === formData.tipo_reporte) || {}

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'tipo_reporte') {
      setFotos([])
      setFormData(prev => ({ ...prev, tipo_reporte: value, direccion: '', google_maps: '', seguimiento: '', especificar: '' }))
      return
    }
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addFiles = (files) => {
    const imgs = Array.from(files || []).filter((f) => f.type.startsWith('image/'))
    setFotos((prev) => [...prev, ...imgs])
  }

  const removeFoto = (idx) => setFotos((prev) => prev.filter((_, i) => i !== idx))

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      const fd = new FormData()
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v))
      for (const f of fotos) {
        const compressed = await compressImage(f)
        fd.append('fotos', compressed)
      }

      const res = await fetch('/api/reportes', { method: 'POST', body: fd })
      const data = await res.json()

      if (res.ok) {
        setStatus({ type: 'success', message: config.success })
        setFormData({
          nombre: '', apellido: '', cedula: '', email: '', telefono: '', tipo_reporte: '',
          direccion: '', google_maps: '', seguimiento: '', especificar: '',
        })
        setFotos([])
      } else {
        setStatus({ type: 'error', message: data.error || 'Ocurrió un error al enviar el reporte.' })
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Error de conexión. Intente nuevamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <PageHeader title={config.title} breadcrumbs={[{ label: 'Reportes', href: '/reportes' }]} />

      <section className="py-20 bg-white min-h-screen">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
            {/* Left Column */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                {config.heading}
              </h2>
              <div className="text-gray-700 leading-relaxed text-base md:text-lg space-y-4">
                <p>
                  {config.description}
                </p>
                <p className="font-medium text-[#254A39]">
                  {config.notice}
                </p>
              </div>
              <div className="pt-4 flex justify-center lg:justify-start">
                <img
                  src="/images/report.svg"
                  alt="Herramienta de Reportes"
                  className="w-56 h-auto drop-shadow-sm opacity-90"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-200">
              {status.message && (
                <div className={`p-4 rounded-xl mb-6 text-sm font-semibold flex items-center space-x-2 ${
                  status.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{status.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre | Apellido */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>{config.labels.nombre} *</label>
                    <input required type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder={config.placeholders.nombre} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{config.labels.apellido} *</label>
                    <input required type="text" name="apellido" value={formData.apellido} onChange={handleChange} placeholder={config.placeholders.apellido} className={inputClass} />
                  </div>
                </div>

                {/* Cédula */}
                <div>
                  <label className={labelClass}>{config.labels.cedula} *</label>
                  <input required type="text" name="cedula" value={formData.cedula} onChange={handleChange} placeholder={config.placeholders.cedula} className={inputClass} />
                  <p className="text-xs text-gray-500 mt-1">{config.idHelp}</p>
                </div>

                {/* Email | Teléfono */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>{config.labels.email} *</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder={config.placeholders.email} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{config.labels.telefono}</label>
                    <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} placeholder={config.placeholders.telefono} className={inputClass} />
                  </div>
                </div>

                {/* Tipo de reporte */}
                <div>
                  <label className={labelClass}>{config.labels.tipo_reporte} *</label>
                  <select
                    required
                    name="tipo_reporte"
                    value={formData.tipo_reporte}
                    onChange={handleChange}
                    className={`${inputClass} bg-white font-medium`}
                  >
                    <option value="">{config.placeholders.tipo_reporte}</option>
                    {config.options.map(({ label: t }) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Seguimiento de luminarias */}
                {fields.seguimiento && (
                  <div>
                    <label className={labelClass}>{config.labels.seguimiento} *</label>
                    <input required type="text" name="seguimiento" value={formData.seguimiento} onChange={handleChange} placeholder={config.placeholders.seguimiento} className={inputClass} />
                  </div>
                )}

                {/* Jornada de parcheo */}
                {fields.especificar && (
                  <div>
                    <label className={labelClass}>{config.labels.especificar} *</label>
                    <textarea required name="especificar" value={formData.especificar} onChange={handleChange} rows="3" placeholder={config.placeholders.especificar} className={inputClass}></textarea>
                  </div>
                )}

                {/* Dirección */}
                {fields.direccion && (
                  <div>
                    <label className={labelClass}>{config.labels.direccion} *</label>
                    <textarea required name="direccion" value={formData.direccion} onChange={handleChange} rows="2" placeholder={config.placeholders.direccion} className={inputClass}></textarea>
                  </div>
                )}

                {/* Google Maps */}
                {fields.maps && (
                  <div>
                    <label className={labelClass}>{config.labels.google_maps}</label>
                    <input type="url" name="google_maps" value={formData.google_maps} onChange={handleChange} placeholder={config.placeholders.google_maps} className={inputClass} />
                  </div>
                )}

                {/* Fotos */}
                {fields.fotos && (
                  <div>
                    <label className={labelClass}>{config.labels.fotos} *</label>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={onDrop}
                      onClick={() => fileRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                        dragOver ? 'border-[#254A39] bg-[#254A39]/5' : 'border-gray-300 hover:border-[#254A39]'
                      }`}
                    >
                      <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-600">{config.photoHelp}</p>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => addFiles(e.target.files)}
                      />
                    </div>

                    {fotos.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                        {fotos.map((f, i) => (
                          <div key={i} className="relative group rounded-lg overflow-hidden border bg-gray-100 aspect-square">
                            <img src={previews[i]} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeFoto(i)}
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow"
                              aria-label="Quitar foto"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#254A39] hover:bg-[#1a3829] text-white font-bold py-4 px-6 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider"
                >
                  {isSubmitting ? config.submitting : config.submit}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
