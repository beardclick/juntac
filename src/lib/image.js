import sharp from 'sharp'
import heicConvert from 'heic-convert'

const DEFAULT_MAX_BYTES = 200 * 1024 // 200 KB
const DEFAULT_MAX_DIMENSION = 1600

// ISO-BMFF brands that indicate a HEIF container (HEIC or AVIF).
const HEIF_BRANDS = [
  'mif1', 'msf1',
  'heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'hevm', 'hevs',
  'avif', 'avis',
]

/** True if the buffer is an ISO-BMFF file whose major brand is a HEIF brand. */
export function isHeifContainer(buffer) {
  if (!buffer || buffer.length < 12) return false
  if (buffer.toString('ascii', 4, 8) !== 'ftyp') return false
  const brand = buffer.toString('ascii', 8, 12).toLowerCase()
  return HEIF_BRANDS.includes(brand)
}

/** True if the buffer is a HEVC-encoded HEIC/HEIF file that sharp cannot read. */
export function isHeicBuffer(buffer) {
  if (!isHeifContainer(buffer)) return false
  const brand = buffer.toString('ascii', 8, 12).toLowerCase()
  // mif1/msf1/avif/avis are handled by sharp (AVIF) or generic; HEVC brands need libheif.
  return ['heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'hevm', 'hevs'].includes(brand)
}

function render(buffer, dimension, quality) {
  return sharp(buffer)
    .rotate() // auto-orient based on EXIF (important for phone photos)
    .resize({ width: dimension, height: dimension, fit: 'inside', withoutEnlargement: true })
    .webp({ quality })
    .toBuffer()
}

async function compressWithSharp(buffer, maxDimension, maxBytes) {
  let quality = 80
  let out = await render(buffer, maxDimension, quality)

  while (out.length > maxBytes && quality > 40) {
    quality -= 10
    out = await render(buffer, maxDimension, quality)
  }

  return out
}

/**
 * Turn an uploaded buffer into a WebP under maxBytes.
 * JPEG/PNG/WebP/AVIF go straight through sharp. HEIC/HEVC (which sharp cannot
 * decode) is first converted to JPEG with libheif, then compressed by sharp.
 */
export async function compressImage(
  buffer,
  { maxBytes = DEFAULT_MAX_BYTES, maxDimension = DEFAULT_MAX_DIMENSION } = {}
) {
  try {
    return await compressWithSharp(buffer, maxDimension, maxBytes)
  } catch (sharpErr) {
    if (!isHeifContainer(buffer)) throw sharpErr
    const jpeg = await heicConvert({ buffer, format: 'JPEG', quality: 0.92 })
    return await compressWithSharp(Buffer.from(jpeg), maxDimension, maxBytes)
  }
}

/** Returns true if the given mime type is a raster image we can compress. */
export function isCompressibleImage(mimeType = '') {
  return /^image\/(jpe?g|png|webp|avif|gif|heic|heif)$/i.test(mimeType)
}

/**
 * Whether an upload should go through compression: either its mime type is a
 * known image, or the buffer itself is a HEIF/HEIC container (some browsers
 * report HEIC with a generic mime type).
 */
export function shouldCompress(buffer, mimeType = '') {
  return isCompressibleImage(mimeType) || isHeifContainer(buffer)
}
