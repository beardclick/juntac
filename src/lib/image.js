import sharp from 'sharp'

const DEFAULT_MAX_BYTES = 200 * 1024 // 200 KB
const DEFAULT_MAX_DIMENSION = 1600

function render(buffer, dimension, quality) {
  return sharp(buffer)
    .rotate() // auto-orient based on EXIF (important for phone photos)
    .resize({ width: dimension, height: dimension, fit: 'inside', withoutEnlargement: true })
    .webp({ quality })
    .toBuffer()
}

/**
 * Compress an image buffer to WebP, resizing to a max dimension and reducing
 * quality until it is under maxBytes (or a minimum quality floor is reached).
 * Returns the compressed buffer.
 */
export async function compressImage(
  buffer,
  { maxBytes = DEFAULT_MAX_BYTES, maxDimension = DEFAULT_MAX_DIMENSION } = {}
) {
  let quality = 80
  let out = await render(buffer, maxDimension, quality)

  while (out.length > maxBytes && quality > 40) {
    quality -= 10
    out = await render(buffer, maxDimension, quality)
  }

  return out
}

/** Returns true if the given mime type is a raster image we can compress. */
export function isCompressibleImage(mimeType = '') {
  return /^image\/(jpe?g|png|webp|avif|gif)$/i.test(mimeType)
}
