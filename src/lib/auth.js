import { createServerClient } from './supabase'

/**
 * Returns true when the incoming request carries a valid Supabase Auth session.
 * This is the single source of truth for admin authorization; it relies on the
 * signed Supabase session cookie (sb-...-auth-token), never on a forgeable flag.
 */
export async function isAdminAuthenticated() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || url.includes('your_supabase') || !key || key.includes('your_supabase')) {
    return false
  }

  try {
    const supabase = createServerClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    return !error && !!user
  } catch (e) {
    console.warn('isAdminAuthenticated warning:', e.message)
    return false
  }
}
