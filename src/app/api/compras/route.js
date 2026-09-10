import { NextResponse } from 'next/server'
import { getPurchases, createPurchase } from '@/lib/db'

export async function GET() {
  try {
    const purchases = await getPurchases()
    return NextResponse.json({ purchases })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    if (!body.title || !body.description) {
      return NextResponse.json({ error: 'Título y descripción son requeridos' }, { status: 400 })
    }

    const newPurchase = await createPurchase(body)
    return NextResponse.json({ success: true, purchase: newPurchase }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
