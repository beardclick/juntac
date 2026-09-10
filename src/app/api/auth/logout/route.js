import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (url && !url.includes('your_supabase') && key && !key.includes('your_supabase')) {
    try {
      const supabase = createServerClient()
      await supabase.auth.signOut()
    } catch (e) {}
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_session', '', {
    maxAge: 0,
    path: '/'
  })
  return response
}
