import { unstable_cache, revalidateTag } from 'next/cache'
import { createAdminClient } from './supabase'
import { defaultReportForm, normalizeReportForm } from './report-form'

export const getReportForm = unstable_cache(async () => {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return defaultReportForm
  const { data, error } = await createAdminClient().from('settings').select('value').eq('key', 'report_form').maybeSingle()
  if (error) throw new Error('No se pudo cargar la configuración del formulario.')
  return data ? normalizeReportForm(typeof data.value === 'string' ? JSON.parse(data.value) : data.value) : defaultReportForm
}, ['report-form'], { revalidate: 300, tags: ['report-form'] })

export async function setReportForm(value) {
  const form = normalizeReportForm(value)
  const { error } = await createAdminClient().from('settings').upsert({ key: 'report_form', value: JSON.stringify(form), updated_at: new Date().toISOString() })
  if (error) throw new Error('No se pudo guardar el formulario.')
  revalidateTag('report-form')
  return form
}
