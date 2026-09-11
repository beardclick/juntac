'use client'
import { useState, useCallback, useEffect } from 'react'

export default function GalleryLightbox({ images }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const imgs = (() => {
    if (Array.isArray(images)) return images
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    }
    return []
  })()

  const close = useCallback(() => setOpen(false), [])
  const prev = useCallback(() => setIndex((i) => (i - 1 + imgs.length) % imgs.length), [imgs.length])
  const next = useCallback(() => setIndex((i) => (i + 1) % imgs.length), [imgs.length])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, close, prev, next])

  if (imgs.length === 0) return null

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {imgs.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => { setIndex(i); setOpen(true) }}
            className="rounded-xl overflow-hidden shadow-sm h-48 bg-gray-100 cursor-zoom-in group"
            aria-label={`Ampliar foto ${i + 1}`}
          >
            <img
              src={src}
              alt={`Foto ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </button>
        ))}
      </div>

      {/* Lightbox overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Galería de fotos"
        >
          {/* Close */}
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Prev */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-3 sm:left-6 z-10 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-3 transition"
            aria-label="Anterior"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Image */}
          <img
            src={imgs[index]}
            alt={`Foto ${index + 1}`}
            className="max-h-[85vh] max-w-[92vw] object-contain select-none"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next() }}
            className="absolute right-3 sm:right-6 z-10 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-3 transition"
            aria-label="Siguiente"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/90 text-sm font-medium bg-black/40 rounded-full px-4 py-1">
            {index + 1} / {imgs.length}
          </div>
        </div>
      )}
    </>
  )
}
