import { NextResponse } from 'next/server'
import { updatePurchase, deletePurchase, getPurchases } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'

export async function GET(request, { params }) {
  try {
    const { id } = params
    const purchases = await getPurchases()
    const purchase = purchases.find(p => String(p.id) === String(id))

    if (!purchase) {
      return NextResponse.json({ error: 'Compra no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ purchase })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const updated = await updatePurchase(id, body)

    if (!updated) {
      return NextResponse.json({ error: 'Error al actualizar compra' }, { status: 404 })
    }

    return NextResponse.json({ success: true, purchase: updated })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = params
    await deletePurchase(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
