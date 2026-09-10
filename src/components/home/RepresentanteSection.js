'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function RepresentanteSection() {
  const sectionRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.fade-up-rep'), {
        opacity: 0,
        y: 35,
        stagger: 0.2,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true }
      })

      gsap.fromTo(imageRef.current,
        { opacity: 0, x: 100 },
        {
          opacity: 1,
          x: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: imageRef.current, start: 'top 85%', once: true }
        }
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section className="py-24 bg-gray-50" ref={sectionRef}>
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: Image repre.jpg - enters from the right */}
        <div className="relative" ref={imageRef}>
          <div className="overflow-hidden rounded-2xl shadow-xl border border-gray-200 bg-white">
            <img 
              src="/images/repre.jpg" 
              alt="H.R. Ashley Martínez" 
              className="object-cover w-full h-[450px] md:h-[550px]"
            />
          </div>
        </div>
        
        {/* Right: Biography */}
        <div className="space-y-6">
          <div className="fade-up-rep">
            <span className="text-[#254A39] font-bold text-xs uppercase tracking-widest bg-[#254A39]/10 px-3 py-1 rounded-full">
              Conoce a tu Representante
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
              H.R. Ashley Martínez
            </h2>
          </div>
          
          <div className="text-gray-600 space-y-4 fade-up-rep text-justify leading-relaxed text-sm md:text-base">
            <p>
              Ashly Martínez Ryfkogel nació el 9 de noviembre de 1994. Desde temprana edad destacó por su disciplina, perseverancia y espíritu emprendedor, valores inculcados por su familia, reconocida por su tradición en el mundo de los negocios.
            </p>
            <p>
              Cursó sus estudios secundarios en el Colegio Liceo Santa María, donde obtuvo el título de Bachiller en Comercio. Posteriormente, continuó su formación académica en la Universidad Latina de Panamá, graduándose como Licenciada en Comercio Internacional y Logística.
            </p>
            <p>
              Su trayectoria profesional y personal refleja un carácter decidido y orientado al crecimiento. Actualmente es propietaria de la Marisquería Ryfkomar, negocio que consolida su visión emprendedora y su compromiso con el desarrollo económico local.
            </p>
            <p>
              Más allá del ámbito empresarial, Ashly también ha sobresalido en el deporte. Gracias a su disciplina y constancia, se convirtió en campeona de fisiculturismo, demostrando que la dedicación y la preparación son la base del éxito en cualquier área de la vida.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
