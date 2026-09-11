'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function DavidSurSection() {
  const sectionRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.fade-up-element'), {
        opacity: 0,
        y: 35,
        stagger: 0.2,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true }
      })

      gsap.fromTo(imageRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: imageRef.current, start: 'top 85%', once: true }
        }
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section className="py-24 bg-white" ref={sectionRef}>
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column: Text */}
        <div className="space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 fade-up-element">
            David Sur Diferente
          </h2>
          
          <div className="text-gray-600 space-y-4 fade-up-element text-justify leading-relaxed">
            <p>
              Bienvenidos a la página oficial de la Junta Comunal de David Sur. Aquí encontrarás información sobre proyectos, noticias, actos públicos y las iniciativas que estamos desarrollando para mejorar la calidad de vida de nuestros residentes.
            </p>
            <p>
              La Junta Comunal de David Sur trabaja día a día por el bienestar de todos sus residentes, impulsando proyectos que promuevan la participación ciudadana, el desarrollo sostenible y la mejora de la calidad de vida en cada uno de nuestros barrios.
            </p>
          </div>

          {/* 2 icon boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 fade-up-element">
            {/* Box 1: Fundación */}
            <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-[#254A39]/10 flex items-center justify-center shrink-0 text-[#254A39]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Fundación:</p>
                <p className="text-xs text-gray-600 mt-0.5">David Sur se fundó 14 de febrero 2018</p>
              </div>
            </div>

            {/* Box 2: Cabecera */}
            <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-[#254A39]/10 flex items-center justify-center shrink-0 text-[#254A39]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Cabecera:</p>
                <p className="text-xs text-gray-600 mt-0.5">San Cristóbal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Fixed/Parallax Image - slides from right */}
        <div 
          ref={imageRef}
          className="rounded-2xl shadow-xl w-full min-h-[420px] md:min-h-[500px] border border-gray-100 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/cerro-san-cristobal.jpg')",
            backgroundAttachment: 'fixed',
          }}
        >
        </div>
      </div>
    </section>
  )
}
