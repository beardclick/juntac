import { NextResponse } from 'next/server'
import { updateNews, deleteNews, getNews } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const { id } = params
    const { news } = await getNews({ limit: 100 })
    const noticia = news.find(n => String(n.id) === String(id))

    if (!noticia) {
      return NextResponse.json({ error: 'Noticia no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ news: noticia })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const updated = await updateNews(id, body)

    if (!updated) {
      return NextResponse.json({ error: 'Error al actualizar noticia' }, { status: 404 })
    }

    return NextResponse.json({ success: true, news: updated })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    await deleteNews(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
