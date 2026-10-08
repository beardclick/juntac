import { updateSession } from './lib/supabase-middleware'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  const pathname = request.nextUrl.pathname
  // Public visits do not need a session refresh or an Auth request.
  if (!pathname.startsWith('/admin')) return NextResponse.next()

  // Skip static files & API routes that don't need auth checking
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/uploads') ||
    pathname.startsWith('/valores') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Update session and protect admin
  return await updateSession(request)
}

export const config = {
  matcher: ['/admin/:path*'],
}
