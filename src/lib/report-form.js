export const defaultReportForm = {
  title: 'Reportes', heading: 'Herramienta de Reportes',
  description: 'En la Junta Comunal de David Sur creemos en la gestión clara y participativa.',
  notice: 'Recuerda un buen uso de nuestro portal de reportes.',
  submit: 'ENVIAR', submitting: 'ENVIANDO...', success: '¡Reporte enviado exitosamente a la Junta Comunal de David Sur!',
  labels: { nombre: 'Nombre', apellido: 'Apellido', cedula: 'Cédula', email: 'Email', telefono: 'Teléfono', tipo_reporte: 'Opción de selección para reporte', seguimiento: 'Detalle el número de reporte o seguimiento', especificar: 'Especificar detalles', direccion: 'Detallar dirección', google_maps: 'Enlace a Google Maps', fotos: 'Adjuntar fotos' },
  placeholders: { nombre: 'Su nombre', apellido: 'Su apellido', cedula: 'x-xxx-xxxx', email: 'correo@ejemplo.com', telefono: '+507 6xxx-xxxx', tipo_reporte: 'Seleccione una opción', seguimiento: 'Número de reporte o seguimiento', especificar: 'Detalle la calle, barriada o punto de referencia exacto...', direccion: 'Barrio, calle, número de casa, etc.', google_maps: 'Puede pegar aquí el enlace a Google Maps de la ubicación' },
  photoHelp: 'Arrastrar y soltar (o) cambiar archivos', idHelp: 'Formato: x-xxx-xxxx',
  options: ['Limpieza de áreas', 'Solicitud de resaltos', 'Limpieza de cunetas', 'Seguimiento de reporte de luminarias', 'Jornada de parcheo'].map((label, index) => ({ label, seguimiento: index === 3, especificar: index === 4, direccion: true, maps: true, fotos: true })),
}

export function normalizeReportForm(value = {}) {
  const result = {}
  for (const [key, fallback] of Object.entries(defaultReportForm)) {
    if (typeof fallback === 'string') result[key] = typeof value[key] === 'string' && value[key].trim() ? value[key].trim().slice(0, 2000) : fallback
  }
  for (const group of ['labels', 'placeholders']) {
    result[group] = Object.fromEntries(Object.entries(defaultReportForm[group]).map(([key, fallback]) => [key, typeof value[group]?.[key] === 'string' && value[group][key].trim() ? value[group][key].trim().slice(0, 500) : fallback]))
  }
  result.options = (Array.isArray(value.options) ? value.options : defaultReportForm.options).slice(0, 50).map(option => ({ label: String(option.label || '').trim().slice(0, 200), ...Object.fromEntries(['seguimiento', 'especificar', 'direccion', 'maps', 'fotos'].map(key => [key, option[key] === true])) })).filter(option => option.label)
  if (!result.options.length || new Set(result.options.map(option => option.label)).size !== result.options.length) throw new Error('Agrega al menos una opción y evita nombres repetidos.')
  return result
}
