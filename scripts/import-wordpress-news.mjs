import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const APPLY = process.argv.includes('--apply')
const XML_PATH = process.argv.find((value) => value.endsWith('.xml')) || 'jcdavidsurgobpa.WordPress.2026-09-10.xml'
const BUCKET = 'media'

const xml = await readFile(XML_PATH, 'utf8')
const items = xml.match(/<item>[\s\S]*?<\/item>/g) || []

function escapedTag(tag) {
  return tag.replace(':', '\\:')
}

function cdata(block, tag) {
  const match = block.match(new RegExp(`<${escapedTag(tag)}>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${escapedTag(tag)}>`))
  return match?.[1] ?? ''
}

function text(block, tag) {
  const match = block.match(new RegExp(`<${escapedTag(tag)}(?:\\s[^>]*)?>([\\s\\S]*?)</${escapedTag(tag)}>`))
  return match?.[1]?.trim() ?? ''
}

function decodeXml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
}

function plainText(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#(?:0*39|x0*27);/gi, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function safeHtml(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, '')
    .replace(/\son\w+\s*=\s*(["']).*?\1/gi, '')
    .trim()
}

function storageName(url, index) {
  const parsed = new URL(url)
  const base = decodeURIComponent(path.posix.basename(parsed.pathname)) || `foto-${index + 1}.jpg`
  return base.replace(/[^a-zA-Z0-9._-]/g, '-')
}

const attachments = new Map()
for (const block of items) {
  if (cdata(block, 'wp:post_type') !== 'attachment') continue
  const attachment = {
    id: text(block, 'wp:post_id'),
    parentId: text(block, 'wp:post_parent'),
    url: decodeXml(cdata(block, 'wp:attachment_url') || text(block, 'wp:attachment_url')),
    mime: cdata(block, 'wp:post_mime_type'),
  }
  attachments.set(attachment.id, attachment)
}

const posts = []
for (const block of items) {
  if (cdata(block, 'wp:post_type') !== 'post' || cdata(block, 'wp:status') !== 'publish') continue

  const id = text(block, 'wp:post_id')
  const thumbnailId = [...block.matchAll(/<wp:meta_key><!\[CDATA\[_thumbnail_id\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(\d+)\]\]><\/wp:meta_value>/g)][0]?.[1]
  const categoryMatch = [...block.matchAll(/<category domain="category" nicename="([^"]*)"><!\[CDATA\[([\s\S]*?)\]\]><\/category>/g)][0]
  const contentImageUrls = [...cdata(block, 'content:encoded').matchAll(/<img[^>]+src=["']([^"']+)["']/gi)]
    .map((match) => decodeXml(match[1]))
  const relatedImages = [...attachments.values()].filter((item) => item.parentId === id && item.mime.startsWith('image/'))
  const featured = attachments.get(thumbnailId)?.url || null
  const content = safeHtml(cdata(block, 'content:encoded'))
  const gallery = [...new Set([...contentImageUrls, ...relatedImages.map((item) => item.url)])]
    .filter((url) => url && url !== featured)
  const publishedAt = new Date(text(block, 'pubDate')).toISOString()

  posts.push({
    wordpress_id: id,
    title: cdata(block, 'title').trim(),
    slug: cdata(block, 'wp:post_name').trim(),
    content,
    excerpt: cdata(block, 'excerpt:encoded').trim() || plainText(content).slice(0, 240),
    category: categoryMatch?.[2]?.trim() || 'General',
    category_slug: categoryMatch?.[1]?.trim() || 'general',
    featured_image: featured,
    gallery,
    published_at: publishedAt,
  })
}

console.log(`XML: ${items.length} elementos, ${attachments.size} adjuntos, ${posts.length} noticias publicadas.`)
for (const post of posts) {
  console.log(`- ${post.title} | ${post.category} | portada=${post.featured_image ? 'sí' : 'no'} | galería=${post.gallery.length}`)
}

if (!APPLY) {
  console.log('Auditoría terminada. Usa --apply para sincronizar Supabase y generar el respaldo local.')
  process.exit(0)
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!supabaseUrl || !serviceKey) throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.')

const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })

async function uploadImage(url, slug, index) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`No se pudo descargar ${url}: HTTP ${response.status}`)
  const bytes = new Uint8Array(await response.arrayBuffer())
  const objectPath = `news/${slug}/${String(index + 1).padStart(2, '0')}-${storageName(url, index)}`
  const { error } = await supabase.storage.from(BUCKET).upload(objectPath, bytes, {
    contentType: response.headers.get('content-type') || 'image/jpeg',
    upsert: true,
  })
  if (error) throw error
  return supabase.storage.from(BUCKET).getPublicUrl(objectPath).data.publicUrl
}

const imported = []
for (const post of posts) {
  const urls = [post.featured_image, ...post.gallery].filter(Boolean)
  const uploaded = []
  for (let index = 0; index < urls.length; index += 1) {
    uploaded.push(await uploadImage(urls[index], post.slug, index))
  }
  imported.push({
    ...post,
    featured_image: post.featured_image ? uploaded[0] : null,
    gallery: post.featured_image ? uploaded.slice(1) : uploaded,
  })
}

const categoryRows = [...new Map(imported.map((post) => [post.category_slug, { name: post.category, slug: post.category_slug }])).values()]
const { error: categoryError } = await supabase.from('categories').upsert(categoryRows, { onConflict: 'slug' })
if (categoryError) throw categoryError

const { data: categories, error: categoriesError } = await supabase.from('categories').select('id,name,slug')
if (categoriesError) throw categoriesError
const categoryIds = new Map(categories.map((category) => [category.slug, category.id]))

const rows = imported.map(({ wordpress_id, category, category_slug, ...post }) => ({
  ...post,
  category_id: categoryIds.get(category_slug),
}))

const xmlSlugs = new Set(rows.map((post) => post.slug))
const { data: existingNews, error: existingError } = await supabase.from('news').select('id,slug')
if (existingError) throw existingError
const obsoleteIds = existingNews.filter((post) => !xmlSlugs.has(post.slug)).map((post) => post.id)
if (obsoleteIds.length) {
  const { error: deleteError } = await supabase.from('news').delete().in('id', obsoleteIds)
  if (deleteError) throw deleteError
}
const { error: newsError } = await supabase.from('news').upsert(rows, { onConflict: 'slug' })
if (newsError) throw newsError

const localRows = imported.map(({ wordpress_id, category_slug, ...post }, index) => ({ id: index + 1, ...post }))
await writeFile('src/lib/wordpress-news.json', `${JSON.stringify(localRows, null, 2)}\n`, 'utf8')
console.log(`Sincronización terminada: ${rows.length} noticias y ${urlsCount(imported)} imágenes.`)

function urlsCount(values) {
  return values.reduce((total, post) => total + (post.featured_image ? 1 : 0) + post.gallery.length, 0)
}

