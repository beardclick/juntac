'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function HeroSection() {
  const contentRef = useRef(null)
  const backgroundRef = useRef(null)
  const graphicRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
      timeline
        .from(backgroundRef.current, { opacity: 0, x: 90, scale: 1.04, duration: 1.35 })
        .from(contentRef.current, { opacity: 0, y: 40, duration: 1 }, '-=0.85')
        .from(graphicRef.current, { opacity: 0, x: 70, duration: 1 }, '-=0.75')
    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background images: desktop vs mobile */}
      <picture ref={backgroundRef} className="absolute inset-0 w-full h-full">
        <source media="(max-width: 768px)" srcSet="/images/hero-mobile.webp" />
        <img
          src="/images/hero.jpg"
          alt="Hero David Sur"
          className="w-full h-full object-cover object-center"
        />
      </picture>

      {/* Green Overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{ backgroundColor: 'rgba(37, 74, 57, 0.78)' }}
      ></div>

      {/* Hero Content */}
      <div className="relative z-20 container mx-auto px-6 text-center max-w-4xl py-24" ref={contentRef}>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-md">
          Junta Comunal David Sur
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto leading-relaxed drop-shadow">
          David Sur: un corregimiento en crecimiento, con visión comunitaria y compromiso con sus ciudadanos.
        </p>
      </div>

      {/* Grafico at bottom full width */}
      <div ref={graphicRef} className="absolute bottom-0 left-0 w-full z-20 pointer-events-none">
        <img
          src="/images/grafico.png"
          alt="Decoración David Sur"
          className="w-full h-auto object-cover opacity-90"
        />
      </div>
    </section>
  )
}
