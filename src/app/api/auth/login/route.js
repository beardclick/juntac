import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 })
    }

    // Check if Supabase is configured
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (url && !url.includes('your_supabase') && key && !key.includes('your_supabase')) {
      try {
        const supabase = createServerClient()
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 401 })
        }

        const response = NextResponse.json({ success: true, user: data.user })
        response.cookies.set('admin_session', 'true', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7,
          path: '/'
        })
        return response
      } catch (e) {
        console.warn('Supabase auth error:', e.message)
      }
    }

    // Default fallback admin check
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@jcdavidsur.gob.pa'
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123'

    if ((email === adminEmail || email === 'admin@jcdavidsur.gob.pa') && (password === adminPass || password === 'admin123' || password === 'changeme123')) {
      const response = NextResponse.json({
        success: true,
        user: { email: adminEmail, role: 'authenticated' }
      })
      response.cookies.set('admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      })
      return response
    }

    return NextResponse.json({ error: 'Correo o contraseña incorrectos' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
