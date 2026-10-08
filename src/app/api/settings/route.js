import { NextResponse } from 'next/server'
import { getReportRecipients, setReportRecipients } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'
import { getReportForm, setReportForm } from '@/lib/report-form-server'

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    const recipients = await getReportRecipients()
    const form = await getReportForm()
    return NextResponse.json({ recipients, form })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    const body = await request.json()
    const form = body.form ? await setReportForm(body.form) : await getReportForm()
    const recipients = await setReportRecipients(body.recipients || [])
    return NextResponse.json({ recipients, form })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
