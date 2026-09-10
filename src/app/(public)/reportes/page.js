'use client'
import { useState } from 'react'
import PageHeader from '@/components/PageHeader'

export default function ReportesPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    email: '',
    telefono: '',
    tipo_reporte: '',
    detalle_parcheo: ''
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      const res = await fetch('/api/reportes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok) {
        setStatus({ type: 'success', message: '¡Reporte enviado exitosamente a la Junta Comunal de David Sur!' })
        setFormData({ nombre: '', apellido: '', cedula: '', email: '', telefono: '', tipo_reporte: '', detalle_parcheo: '' })
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
      <PageHeader title="Reportes" breadcrumbs={[{ label: 'Reportes', href: '/reportes' }]} />

      <section className="py-20 bg-white min-h-screen">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
            
            {/* Left Column */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Herramienta de Reportes
              </h2>
              
              <div className="text-gray-700 leading-relaxed text-base md:text-lg space-y-4">
                <p>
                  En la Junta Comunal de David Sur creemos en la gestión clara y participativa.
                </p>
                <p className="font-medium text-[#254A39]">
                  Recuerda un buen uso de nuestro portal de reportes.
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
                {/* Nombre | Apellido * */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      required
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Su nombre"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#254A39] outline-none text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Apellido *
                    </label>
                    <input
                      required
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      placeholder="Su apellido"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#254A39] outline-none text-gray-900"
                    />
                  </div>
                </div>

                {/* Cédula * */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cédula *
                  </label>
                  <input
                    required
                    type="text"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                    placeholder="x-xxx-xxxx"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#254A39] outline-none text-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-1">Formato: x-xxx-xxxx</p>
                </div>

                {/* Email * | Teléfono */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="correo@ejemplo.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#254A39] outline-none text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="+507 6xxx-xxxx"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#254A39] outline-none text-gray-900"
                    />
                  </div>
                </div>

                {/* Opción de selección para reporte * */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Opción de selección para reporte *
                  </label>
                  <select
                    required
                    name="tipo_reporte"
                    value={formData.tipo_reporte}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#254A39] outline-none bg-white text-gray-800 font-medium"
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="Limpieza de áreas verdes">Limpieza de áreas verdes</option>
                    <option value="Solicitud de resaltos">Solicitud de resaltos</option>
                    <option value="Limpieza de cuneta">Limpieza de cuneta</option>
                    <option value="Jornadas de parcheo">Jornadas de parcheo (especificar)</option>
                  </select>
                </div>

                {/* Detalle si selecciona Jornadas de parcheo u otra especificación */}
                {formData.tipo_reporte === 'Jornadas de parcheo' && (
                  <div className="animate-fadeIn">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Especificar ubicación / detalles de la calle *
                    </label>
                    <textarea
                      required
                      name="detalle_parcheo"
                      value={formData.detalle_parcheo}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Indique la calle, barriada o punto de referencia exacto..."
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#254A39] outline-none text-gray-900"
                    ></textarea>
                  </div>
                )}

                {/* Submit button: ENVIAR */}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#254A39] hover:bg-[#1a3829] text-white font-bold py-4 px-6 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider"
                >
                  {isSubmitting ? 'ENVIANDO...' : 'ENVIAR'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
