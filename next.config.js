/** @type {import('next').NextConfig} */
const nextConfig = {
  // Load HEIC conversion (WASM) from node_modules at runtime instead of bundling it.
  serverExternalPackages: ['heic-convert', 'heic-decode', 'libheif-js'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jcdavidsur.gob.pa',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig
