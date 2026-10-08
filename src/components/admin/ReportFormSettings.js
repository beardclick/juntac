'use client'

export default function ReportFormSettings({ value, onChange }) {
  if (!value) return null
  const textInput = (key, label, group) => (
    <label key={key} className="block text-sm font-semibold text-gray-700">
      {label}
      <input className="block w-full border rounded-lg p-3 mt-1 font-normal" value={group ? value[group][key] : value[key]} onChange={event => onChange(group ? { ...value, [group]: { ...value[group], [key]: event.target.value } } : { ...value, [key]: event.target.value })} />
    </label>
  )
  const updateOption = (index, patch) => onChange({ ...value, options: value.options.map((option, i) => i === index ? { ...option, ...patch } : option) })
  return <section className="bg-white rounded-2xl border p-6 max-w-3xl space-y-5">
    <h3 className="text-lg font-bold">Formulario público de contacto y reportes</h3>
    <p className="text-sm text-gray-600">Edita los textos y las opciones. Las casillas indican qué campos muestra cada opción. Guarda con el botón «Guardar cambios».</p>
    {Object.entries({ title: 'Título de página', heading: 'Encabezado', description: 'Descripción', notice: 'Aviso', submit: 'Botón de envío', submitting: 'Texto durante el envío', success: 'Confirmación de envío', idHelp: 'Ayuda de cédula', photoHelp: 'Ayuda para adjuntar fotos' }).map(([key, label]) => textInput(key, label))}
    <h4 className="font-bold">Etiquetas de campos</h4>
    <div className="grid sm:grid-cols-2 gap-4">{Object.keys(value.labels).map(key => textInput(key, key, 'labels'))}</div>
    <h4 className="font-bold">Textos de ejemplo y selección</h4>
    <div className="grid sm:grid-cols-2 gap-4">{Object.keys(value.placeholders).map(key => textInput(key, key, 'placeholders'))}</div>
    <h4 className="font-bold">Opciones del formulario</h4>
    {value.options.map((option, index) => <div key={index} className="border rounded-lg p-4 space-y-3">
      <label className="block">Nombre de la opción<input aria-label={`Nombre de opción ${index + 1}`} className="block w-full border rounded p-2" value={option.label} onChange={event => updateOption(index, { label: event.target.value })} /></label>
      <div className="flex flex-wrap gap-4">{Object.entries({ direccion: 'Dirección', maps: 'Google Maps', fotos: 'Fotos', seguimiento: 'Seguimiento', especificar: 'Detalles' }).map(([key, label]) => <label key={key}><input type="checkbox" checked={option[key]} onChange={event => updateOption(index, { [key]: event.target.checked })} /> {label}</label>)}</div>
      <button type="button" className="text-red-700" onClick={() => onChange({ ...value, options: value.options.filter((_, i) => i !== index) })}>Quitar opción</button>
    </div>)}
    <button type="button" className="border rounded px-4 py-2" onClick={() => onChange({ ...value, options: [...value.options, { label: '', direccion: true, maps: true, fotos: true, seguimiento: false, especificar: false }] })}>Agregar opción</button>
  </section>
}
