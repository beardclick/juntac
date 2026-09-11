import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (url && !url.includes('your_supabase') && key && !key.includes('your_supabase')) {
    try {
      const supabase = await createServerClient()
      await supabase.auth.signOut()
    } catch (e) {
      console.warn('Logout signOut warning:', e.message)
    }
  }

  return NextResponse.json({ success: true })
}
