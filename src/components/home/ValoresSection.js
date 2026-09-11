'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const valores = [
  {
    id: 1,
    title: 'Compromiso comunitario',
    desc: 'Trabajamos con responsabilidad por el bienestar de cada ciudadano.',
    icon: '/images/valores/compromiso.svg'
  },
  {
    id: 2,
    title: 'Solidaridad',
    desc: 'Impulsamos la ayuda mutua y el apoyo a quienes más lo necesitan.',
    icon: '/images/valores/solidaridad.svg'
  },
  {
    id: 3,
    title: 'Transparencia',
    desc: 'Administramos los recursos de forma clara y responsable.',
    icon: '/images/valores/transparencia.svg'
  },
  {
    id: 4,
    title: 'Participación ciudadana',
    desc: 'Promovemos la inclusión de los vecinos en las decisiones y proyectos.',
    icon: '/images/valores/participacion.svg'
  },
  {
    id: 5,
    title: 'Respeto',
    desc: 'Fomentamos la convivencia pacífica y la valoración de la diversidad.',
    icon: '/images/valores/respeto.svg'
  },
  {
    id: 6,
    title: 'Innovación social',
    desc: 'Buscamos soluciones creativas y sostenibles para el desarrollo del corregimiento.',
    icon: '/images/valores/innovacion.svg'
  }
]

export default function ValoresSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.valor-card'), {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      })

      gsap.from(el.querySelectorAll('.valor-icon'), {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section className="py-24 bg-white" ref={sectionRef}>
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Valores</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {valores.map(valor => (
            <div key={valor.id} className="valor-card p-8 rounded-2xl bg-gray-50 hover:shadow-lg transition-shadow border border-gray-100">
              <img src={valor.icon} alt={valor.title} className="valor-icon w-12 h-12 mb-6" />
              <h3 className="text-xl font-bold text-[#254A39] mb-3">{valor.title}</h3>
              <p className="text-gray-600 leading-relaxed">{valor.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
