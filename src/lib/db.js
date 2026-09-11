import { initialPurchases, initialCategories } from './initial-data'
import wordpressNews from './wordpress-news.json'
import { createServerClient, createAdminClient } from './supabase'

// In-memory runtime storage for when Supabase is not connected
let memoryNews = [...wordpressNews]
let memoryPurchases = [...initialPurchases]
let memoryReports = []
let memoryMedia = [
  { id: 1, filename: 'hero.jpg', original_name: 'hero.jpg', mime_type: 'image/jpeg', size: 387632, url: '/images/hero.jpg', uploaded_at: '2026-09-01' },
  { id: 2, filename: 'logo-sticky.webp', original_name: 'logo-sticky.webp', mime_type: 'image/webp', size: 43114, url: '/images/logo-sticky.webp', uploaded_at: '2026-09-01' },
  { id: 3, filename: 'repre.jpg', original_name: 'repre.jpg', mime_type: 'image/jpeg', size: 366496, url: '/images/repre.jpg', uploaded_at: '2026-09-01' },
  { id: 4, filename: 'CONSTRUCION-DE-CASETAS.pdf', original_name: 'CONSTRUCION-DE-CASETAS.pdf', mime_type: 'application/pdf', size: 524288, url: 'https://jcdavidsur.gob.pa/wp-content/uploads/2026/01/CONSTRUCION-DE-CASETAS.pdf', uploaded_at: '2026-05-01' },
  { id: 5, filename: 'I-Conv.-Mejoramiento-de-Parques.pdf', original_name: 'I-Conv.-Mejoramiento-de-Parques.pdf', mime_type: 'application/pdf', size: 612400, url: 'https://jcdavidsur.gob.pa/wp-content/uploads/2026/05/I-Conv.-Mejoramiento-de-Parques.pdf', uploaded_at: '2026-05-15' }
]

function hasSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return url && !url.includes('your_supabase') && key && !key.includes('your_supabase')
}

// Resolve the news category name (e.g. "Gestión") to its numeric id, since the
// `news` table stores `category_id` (FK) and the admin form submits the name.
async function resolveCategoryId(categoryName) {
  if (!categoryName) return null
  try {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('categories')
      .select('id')
      .eq('name', categoryName)
      .maybeSingle()
    if (!error && data) return data.id
  } catch (e) {
    console.warn('resolveCategoryId warning:', e.message)
  }
  return null
}

async function prepareNewsPayload(newsData) {
  const { category, category_id, ...rest } = newsData
  let resolvedId = category_id != null ? category_id : null
  if (resolvedId == null && category) {
    resolvedId = await resolveCategoryId(category)
  }
  return { ...rest, category_id: resolvedId }
}

// ---------------- NEWS ----------------
export async function getNews({ limit = 100, page = 1 } = {}) {
  if (hasSupabaseConfig()) {
    try {
      const supabase = await createServerClient()
      const from = (page - 1) * limit
      const to = from + limit - 1
      const { data, error, count } = await supabase
        .from('news')
        .select('*, categories(name, slug)', { count: 'exact' })
        .order('published_at', { ascending: false })
        .range(from, to)

      if (!error && data && data.length > 0) {
        return {
          news: data.map(item => ({
            ...item,
            category: item.categories?.name || 'General'
          })),
          total: count || data.length
        }
      }
    } catch (e) {
      console.warn('Supabase getNews fallback to memory:', e.message)
    }
  }

  const sorted = [...memoryNews].sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
  const start = (page - 1) * limit
  return {
    news: sorted.slice(start, start + limit),
    total: sorted.length
  }
}

export async function getNewsBySlug(slug) {
  if (hasSupabaseConfig()) {
    try {
      const supabase = await createServerClient()
      const { data, error } = await supabase
        .from('news')
        .select('*, categories(name, slug)')
        .eq('slug', slug)
        .single()

      if (!error && data) {
        return {
          ...data,
          category: data.categories?.name || 'General'
        }
      }
    } catch (e) {
      console.warn('Supabase getNewsBySlug fallback to memory:', e.message)
    }
  }

  return memoryNews.find(n => n.slug === slug) || null
}

export async function createNews(newsData) {
  if (hasSupabaseConfig()) {
    try {
      const admin = createAdminClient()
      const payload = await prepareNewsPayload(newsData)
      const { data, error } = await admin.from('news').insert([payload]).select().single()
      if (!error && data) return data
    } catch (e) {
      console.warn('Supabase createNews fallback:', e.message)
    }
  }

  const newItem = {
    id: Date.now(),
    ...newsData,
    created_at: new Date().toISOString()
  }
  memoryNews.unshift(newItem)
  return newItem
}

export async function updateNews(id, newsData) {
  if (hasSupabaseConfig()) {
    try {
      const admin = createAdminClient()
      const payload = await prepareNewsPayload(newsData)
      const { data, error } = await admin.from('news').update(payload).eq('id', id).select().single()
      if (!error && data) return data
    } catch (e) {
      console.warn('Supabase updateNews fallback:', e.message)
    }
  }

  const idx = memoryNews.findIndex(n => String(n.id) === String(id))
  if (idx !== -1) {
    memoryNews[idx] = { ...memoryNews[idx], ...newsData, updated_at: new Date().toISOString() }
    return memoryNews[idx]
  }
  return null
}

export async function deleteNews(id) {
  if (hasSupabaseConfig()) {
    try {
      const admin = createAdminClient()
      await admin.from('news').delete().eq('id', id)
      return true
    } catch (e) {
      console.warn('Supabase deleteNews fallback:', e.message)
    }
  }

  memoryNews = memoryNews.filter(n => String(n.id) !== String(id))
  return true
}

// ---------------- PURCHASES / TRANSPARENCIA ----------------
export async function getPurchases() {
  const today = new Date().toISOString().split('T')[0]

  if (hasSupabaseConfig()) {
    try {
      const supabase = await createServerClient()
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .order('publication_date', { ascending: false })

      if (!error && data && data.length > 0) {
        return data.map(p => {
          let status = p.status
          if (status === 'activo' && p.deadline_date && p.deadline_date < today) {
            status = 'expirado'
          }
          return { ...p, status }
        })
      }
    } catch (e) {
      console.warn('Supabase getPurchases fallback to memory:', e.message)
    }
  }

  return memoryPurchases.map(p => {
    let status = p.status
    if (status === 'activo' && p.deadline_date && p.deadline_date < today) {
      status = 'expirado'
    }
    return { ...p, status }
  })
}

export async function getPurchaseBySlug(slug) {
  const purchases = await getPurchases()
  return purchases.find(p => p.slug === slug) || null
}

export async function createPurchase(purchaseData) {
  if (hasSupabaseConfig()) {
    try {
      const admin = createAdminClient()
      const { data, error } = await admin.from('purchases').insert([purchaseData]).select().single()
      if (!error && data) return data
    } catch (e) {
      console.warn('Supabase createPurchase fallback:', e.message)
    }
  }

  const newItem = {
    id: Date.now(),
    ...purchaseData,
    created_at: new Date().toISOString()
  }
  memoryPurchases.unshift(newItem)
  return newItem
}

export async function updatePurchase(id, purchaseData) {
  if (hasSupabaseConfig()) {
    try {
      const admin = createAdminClient()
      const { data, error } = await admin.from('purchases').update(purchaseData).eq('id', id).select().single()
      if (!error && data) return data
    } catch (e) {
      console.warn('Supabase updatePurchase fallback:', e.message)
    }
  }

  const idx = memoryPurchases.findIndex(p => String(p.id) === String(id))
  if (idx !== -1) {
    memoryPurchases[idx] = { ...memoryPurchases[idx], ...purchaseData, updated_at: new Date().toISOString() }
    return memoryPurchases[idx]
  }
  return null
}

export async function deletePurchase(id) {
  if (hasSupabaseConfig()) {
    try {
      const admin = createAdminClient()
      await admin.from('purchases').delete().eq('id', id)
      return true
    } catch (e) {
      console.warn('Supabase deletePurchase fallback:', e.message)
    }
  }

  memoryPurchases = memoryPurchases.filter(p => String(p.id) !== String(id))
  return true
}

// ---------------- REPORTS ----------------
export async function getReports() {
  if (hasSupabaseConfig()) {
    try {
      const admin = createAdminClient()
      const { data, error } = await admin.from('reports').select('*').order('created_at', { ascending: false })
      if (!error && data) return data
    } catch (e) {
      console.warn('Supabase getReports fallback:', e.message)
    }
  }
  return memoryReports
}

export async function createReport(reportData) {
  if (hasSupabaseConfig()) {
    try {
      const admin = createAdminClient()
      const { data, error } = await admin.from('reports').insert([reportData]).select().single()
      if (!error && data) return data
    } catch (e) {
      console.warn('Supabase createReport fallback:', e.message)
    }
  }

  const newReport = {
    id: Date.now(),
    ...reportData,
    created_at: new Date().toISOString()
  }
  memoryReports.unshift(newReport)
  return newReport
}

export async function deleteReport(id) {
  if (hasSupabaseConfig()) {
    try {
      const admin = createAdminClient()
      await admin.from('reports').delete().eq('id', id)
      return true
    } catch (e) {
      console.warn('Supabase deleteReport fallback:', e.message)
    }
  }

  memoryReports = memoryReports.filter(r => String(r.id) !== String(id))
  return true
}

// ---------------- MEDIA ----------------
export async function getMedia() {
  if (hasSupabaseConfig()) {
    try {
      const admin = createAdminClient()
      const { data, error } = await admin.from('media').select('*').order('uploaded_at', { ascending: false })
      if (!error && data && data.length > 0) return data
    } catch (e) {
      console.warn('Supabase getMedia fallback:', e.message)
    }
  }
  return memoryMedia
}

export async function addMedia(mediaItem) {
  if (hasSupabaseConfig()) {
    try {
      const admin = createAdminClient()
      const { data, error } = await admin.from('media').insert([mediaItem]).select().single()
      if (!error && data) return data
    } catch (e) {
      console.warn('Supabase addMedia fallback:', e.message)
    }
  }

  const newItem = {
    id: Date.now(),
    ...mediaItem,
    uploaded_at: new Date().toISOString()
  }
  memoryMedia.unshift(newItem)
  return newItem
}

export async function deleteMedia(id) {
  if (hasSupabaseConfig()) {
    try {
      const admin = createAdminClient()
      await admin.from('media').delete().eq('id', id)
      return true
    } catch (e) {
      console.warn('Supabase deleteMedia fallback:', e.message)
    }
  }

  memoryMedia = memoryMedia.filter(m => String(m.id) !== String(id))
  return true
}
