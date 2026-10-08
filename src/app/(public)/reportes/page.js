import ReportForm from '@/components/reports/ReportForm'
import { getReportForm } from '@/lib/report-form-server'

export const revalidate = 300

export default async function ReportesPage() {
  return <ReportForm config={await getReportForm()} />
}
