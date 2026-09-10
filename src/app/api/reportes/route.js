import { NextResponse } from 'next/server'
import { createReport } from '@/lib/db'
import nodemailer from 'nodemailer'

export async function POST(request) {
  try {
    const data = await request.json()
    const { nombre, apellido, cedula, email, telefono, tipo_reporte, detalle_parcheo } = data

    // Validate required fields
    if (!nombre || !apellido || !cedula || !email || !tipo_reporte) {
      return NextResponse.json({ error: 'Faltan campos requeridos obligatorios (*).' }, { status: 400 })
    }

    // Save to Database / runtime store
    const savedReport = await createReport({
      nombre,
      apellido,
      cedula,
      email,
      telefono: telefono || '',
      tipo_reporte,
      detalles: detalle_parcheo || ''
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
            pass: process.env.SMTP_PASS
          }
        })

        const html = `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 8px;">
            <h2 style="color: #254A39;">Nuevo Reporte Ciudadano - Junta Comunal David Sur</h2>
            <hr style="border: 0; border-top: 1px solid #254A39; margin: 15px 0;">
            <p><strong>Ciudadano:</strong> ${nombre} ${apellido}</p>
            <p><strong>Cédula:</strong> ${cedula}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Teléfono:</strong> ${telefono || 'No especificado'}</p>
            <p><strong>Tipo de Reporte:</strong> <span style="background: #254A39; color: white; padding: 3px 8px; border-radius: 4px;">${tipo_reporte}</span></p>
            ${detalle_parcheo ? `<p><strong>Detalle / Ubicación:</strong><br>${detalle_parcheo}</p>` : ''}
            <p style="font-size: 12px; color: #888; margin-top: 25px;">Enviado desde el portal web oficial de la Junta Comunal de David Sur.</p>
          </div>
        `

        await transporter.sendMail({
          from: `"Junta Comunal David Sur" <${process.env.SMTP_USER}>`,
          to: process.env.REPORT_RECIPIENT || process.env.SMTP_USER,
          subject: `📢 Nuevo Reporte: ${tipo_reporte} (${nombre} ${apellido})`,
          html
        })
      } catch (emailErr) {
        console.warn('Email notification error (non-fatal):', emailErr.message)
      }
    }

    return NextResponse.json({ success: true, report: savedReport })
  } catch (error) {
    console.error('Report API Error:', error)
    return NextResponse.json({ error: 'Error interno al procesar el reporte.' }, { status: 500 })
  }
}
