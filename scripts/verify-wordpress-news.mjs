import { readFile } from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'

const expected = JSON.parse(await readFile('src/lib/wordpress-news.json', 'utf8'))
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

const { data, error } = await supabase
  .from('news')
  .select('title,slug,content,featured_image,gallery,categories(name,slug)')
  .order('published_at', { ascending: false })

if (error) throw error

const actualBySlug = new Map(data.map((post) => [post.slug, post]))
const failures = []
const imageUrls = []

for (const post of expected) {
  const actual = actualBySlug.get(post.slug)
  if (!actual) {
    failures.push(`${post.slug}: no existe en Supabase`)
    continue
  }
  if (actual.title !== post.title) failures.push(`${post.slug}: título diferente`)
  if (actual.content !== post.content) failures.push(`${post.slug}: contenido diferente`)
  if (actual.categories?.name !== post.category) failures.push(`${post.slug}: categoría diferente`)
  if ((actual.gallery || []).length !== post.gallery.length) failures.push(`${post.slug}: cantidad de galería diferente`)
  imageUrls.push(actual.featured_image, ...(actual.gallery || []))
}

if (data.length !== expected.length) failures.push(`cantidad: Supabase=${data.length}, XML=${expected.length}`)

let imageFailures = 0
for (const url of imageUrls.filter(Boolean)) {
  const response = await fetch(url, { method: 'HEAD' })
  if (!response.ok) {
    imageFailures += 1
    failures.push(`imagen HTTP ${response.status}: ${url}`)
  }
}

console.log(`Noticias verificadas: ${expected.length}`)
console.log(`Imágenes verificadas: ${imageUrls.filter(Boolean).length}`)
console.log(`Fallos de imágenes: ${imageFailures}`)

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log('Contenido, títulos, categorías y galerías coinciden con el XML.')
