import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const pathname = request.nextUrl.pathname
  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login'

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  let isAuthenticated = false

  // Check custom admin session cookie first
  const adminCookie = request.cookies.get('admin_session')?.value
  if (adminCookie === 'true') {
    isAuthenticated = true
  }

  // Check Supabase session if configured
  if (!isAuthenticated && url && !url.includes('your_supabase') && key && !key.includes('your_supabase')) {
    try {
      const supabase = createServerClient(url, key, {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value
          },
          set(name, value, options) {
            request.cookies.set({ name, value, ...options })
            response = NextResponse.next({
              request: { headers: request.headers },
            })
            response.cookies.set({ name, value, ...options })
          },
          remove(name, options) {
            request.cookies.set({ name, value: '', ...options })
            response = NextResponse.next({
              request: { headers: request.headers },
            })
            response.cookies.set({ name, value: '', ...options })
          },
        },
      })

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        isAuthenticated = true
      }
    } catch (e) {
      console.warn('Middleware auth check warning:', e.message)
    }
  }

  // Protect /admin routes
  if (isAdminRoute && !isAuthenticated) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    return NextResponse.redirect(loginUrl)
  }

  return response
}
