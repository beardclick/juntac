import { NextResponse } from 'next/server'
import { deleteReport } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'

export async function DELETE(request, { params }) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 })
    }

    await deleteReport(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
