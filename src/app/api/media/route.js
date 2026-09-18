import { NextResponse } from 'next/server'
import { getMedia, addMedia, deleteMedia } from '@/lib/db'
import { createAdminClient } from '@/lib/supabase'
import { isAdminAuthenticated } from '@/lib/auth'
import { compressImage, isCompressibleImage } from '@/lib/image'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const media = await getMedia()
    return NextResponse.json({ media })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    let buffer = Buffer.from(bytes)
    let contentType = file.type
    let ext = path.extname(file.name)

    // Compress raster images to WebP (~under 200 KB) before storing
    if (isCompressibleImage(file.type)) {
      try {
        buffer = await compressImage(buffer)
        contentType = 'image/webp'
        ext = '.webp'
      } catch (compressErr) {
        console.warn('Image compression skipped:', compressErr.message)
      }
    }

    const originalName = file.name
    const cleanBaseName = path.basename(originalName, path.extname(originalName))
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
    const uniqueFilename = `${cleanBaseName}-${Date.now()}${ext}`

    let fileUrl = `/uploads/${uniqueFilename}`

    // Try uploading to Supabase Storage if configured
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (url && !url.includes('your_supabase') && key && !key.includes('your_service_role')) {
      try {
        const supabase = createAdminClient()
        const bucket = 'media'
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(uniqueFilename, buffer, {
            contentType,
            upsert: true
          })

        if (!uploadError && uploadData) {
          const { data: publicUrlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(uniqueFilename)

          if (publicUrlData?.publicUrl) {
            fileUrl = publicUrlData.publicUrl
          }
        }
      } catch (storageErr) {
        console.warn('Supabase storage upload error, saving locally:', storageErr.message)
      }
    }

    // Always save locally to public/uploads as reliable fallback
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      await mkdir(uploadDir, { recursive: true })
      const filePath = path.join(uploadDir, uniqueFilename)
      await writeFile(filePath, buffer)
    } catch (fsErr) {
      console.warn('Local fs save error:', fsErr.message)
    }

    // Save record to DB
    const mediaRecord = await addMedia({
      filename: uniqueFilename,
      original_name: originalName,
      mime_type: contentType,
      size: buffer.length,
      url: fileUrl
    })

    return NextResponse.json({
      success: true,
      url: fileUrl,
      media: mediaRecord
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 })
    }

    await deleteMedia(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
