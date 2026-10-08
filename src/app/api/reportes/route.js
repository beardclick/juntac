import { NextResponse } from 'next/server'
import { createReport, getReportRecipients } from '@/lib/db'
import { createAdminClient } from '@/lib/supabase'
import { compressImage, isCompressibleImage } from '@/lib/image'
import nodemailer from 'nodemailer'
import { getReportForm } from '@/lib/report-form-server'

export async function POST(request) {
  try {
    let formData
    try {
      formData = await request.formData()
    } catch (e) {
      return NextResponse.json({ error: 'Los archivos adjuntos son demasiado pesados. Reduce el tamaño de las fotos e intenta nuevamente.' }, { status: 413 })
    }
    const get = (k) => (formData.get(k) || '').toString().trim()

    const nombre = get('nombre')
    const apellido = get('apellido')
    const cedula = get('cedula')
    const email = get('email')
    const telefono = get('telefono')
    const tipo_reporte = get('tipo_reporte')
    const direccion = get('direccion')
    const google_maps = get('google_maps')
    const seguimiento = get('seguimiento')
    const especificar = get('especificar')

    if (!nombre || !apellido || !cedula || !email || !tipo_reporte) {
      return NextResponse.json({ error: 'Faltan campos requeridos obligatorios (*).' }, { status: 400 })
    }
    const config = await getReportForm()
    const option = config.options.find(item => item.label === tipo_reporte)
    if (!option) return NextResponse.json({ error: 'La opción seleccionada ya no está disponible. Recarga el formulario.' }, { status: 400 })
    if ((option.direccion && !direccion) || (option.seguimiento && !seguimiento) || (option.especificar && !especificar)) {
      return NextResponse.json({ error: 'Completa los campos requeridos de esta opción.' }, { status: 400 })
    }

    // Upload photos to Supabase Storage (bucket "media")
    const fotos = formData
      .getAll('fotos')
      .filter((f) => f && typeof f === 'object' && typeof f.arrayBuffer === 'function' && f.name)

    // Validate photos (size + type) with clear messages
    for (const file of fotos) {
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: 'Una de las fotos es demasiado pesada (máximo 10 MB). Usa una imagen más pequeña.' }, { status: 413 })
      }
      if (!isCompressibleImage(file.type)) {
        return NextResponse.json({ error: 'Solo se permiten imágenes (JPG, PNG o WebP). Revisa los archivos adjuntos.' }, { status: 400 })
      }
    }

    const photoUrls = []
    const attachments = []

    if (fotos.length > 0) {
      try {
        const admin = createAdminClient()
        for (const file of fotos) {
          let bytes = Buffer.from(await file.arrayBuffer())
          let ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
          let contentType = file.type || 'image/jpeg'

          if (isCompressibleImage(file.type)) {
            try {
              bytes = await compressImage(bytes)
              ext = 'webp'
              contentType = 'image/webp'
            } catch (compressErr) {
              console.warn('Foto compression skipped:', compressErr.message)
            }
          }

          const unique = `reporte-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

          const { error } = await admin.storage
            .from('media')
            .upload(unique, bytes, { contentType, upsert: true })

          if (!error) {
            const { data } = admin.storage.from('media').getPublicUrl(unique)
            if (data?.publicUrl) photoUrls.push(data.publicUrl)
          }

          attachments.push({ filename: `foto-${attachments.length + 1}.${ext}`, content: bytes })
        }
      } catch (e) {
        console.warn('Foto upload warning:', e.message)
      }
    }

    // Build a readable "detalles" string with the conditional fields
    const partes = []
    if (seguimiento) partes.push(`Número de reporte o seguimiento: ${seguimiento}`)
    if (especificar) partes.push(`Especificar detalles: ${especificar}`)
    if (direccion) partes.push(`Dirección: ${direccion}`)
    if (google_maps) partes.push(`Enlace a Google Maps: ${google_maps}`)
    if (photoUrls.length) partes.push(`Fotos: ${photoUrls.join('\n')}`)
    const detalles = partes.join('\n')

    const savedReport = await createReport({
      nombre,
      apellido,
      cedula,
      email,
      telefono: telefono || '',
      tipo_reporte,
      detalles,
    })

    // Send email notification if SMTP is configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_PORT === '465',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        })

        const row = (label, value) =>
          value
            ? `<p><strong>${label}:</strong> ${value}</p>`
            : ''

        const html = `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #254A39;">Nuevo Reporte Ciudadano - Junta Comunal David Sur</h2>
            <hr style="border: 0; border-top: 1px solid #254A39; margin: 15px 0;">
            <p><strong>Ciudadano:</strong> ${nombre} ${apellido}</p>
            <p><strong>Cédula:</strong> ${cedula}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${row('Teléfono', telefono)}
            <p><strong>Tipo de Reporte:</strong> <span style="background: #254A39; color: white; padding: 3px 8px; border-radius: 4px;">${tipo_reporte}</span></p>
            ${row('Número de reporte o seguimiento', seguimiento)}
            ${row('Especificar detalles', especificar)}
            ${row('Dirección', direccion)}
            ${google_maps ? `<p><strong>Enlace a Google Maps:</strong> <a href="${google_maps}">${google_maps}</a></p>` : ''}
            ${photoUrls.length ? `<p><strong>Fotos:</strong> ${photoUrls.map((u) => `<a href="${u}">${u}</a>`).join('<br>')}</p>` : ''}
            <p style="font-size: 12px; color: #888; margin-top: 25px;">Enviado desde el portal web oficial de la Junta Comunal de David Sur.</p>
          </div>
        `

        const recipients = await getReportRecipients()
        await transporter.sendMail({
          from: `"Junta Comunal David Sur" <${process.env.SMTP_USER}>`,
          to: recipients.join(','),
          subject: `📢 Nuevo Reporte: ${tipo_reporte} (${nombre} ${apellido})`,
          html,
          attachments,
        })
        console.log('Report email sent to', recipients.join(', '))
      } catch (emailErr) {
        console.warn('Email notification error (non-fatal):', emailErr.message)
      }
    }

    return NextResponse.json({ success: true, report: savedReport })
  } catch (error) {
    console.error('Report API Error:', error)
    const msg = error && error.message ? error.message : String(error)
    return NextResponse.json({ error: `Error interno al procesar el reporte: ${msg}` }, { status: 500 })
  }
}
