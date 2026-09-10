'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function CtaSection() {
  const sectionRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(imageRef.current, {
        opacity: 0,
        x: 100,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: imageRef.current, start: 'top 88%', once: true }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-[#254A39] text-white pt-20 pb-16 relative overflow-visible mt-16 md:mt-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Floating Image consulta.png with negative top margin */}
          <div ref={imageRef} className="flex justify-center md:justify-start -mt-24 md:-mt-36 z-20">
            <img 
              src="/images/consulta.png" 
              alt="Consulta Ciudadana" 
              className="w-72 sm:w-80 md:w-96 drop-shadow-2xl object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Right: Content */}
          <div className="space-y-6 text-left py-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Consulta Ciudadana
            </h2>
            <p className="text-base sm:text-lg text-gray-200 leading-relaxed text-justify">
              El menú, según la Resolución 123 de 2020, informa sobre mecanismos para fomentar la participación ciudadana en la gestión pública.
            </p>
            <div className="pt-2">
              <Link 
                href="/consulta-ciudadana" 
                className="inline-block px-8 py-3.5 bg-white text-[#254A39] font-bold rounded-lg shadow-lg hover:bg-gray-100 transition-all transform hover:-translate-y-0.5"
              >
                Conocer Más
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
