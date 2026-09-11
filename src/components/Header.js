'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  return (
    <>
      <header className={`fixed w-full z-[500] transition-all duration-300 ${scrolled ? 'header-sticky' : 'header-transparent'}`}>
        {/* Top Header - desktop only, leaves the viewport after scrolling */}
        {!scrolled && <div className="top-header bg-[#254A39] text-white text-sm py-2 hidden md:block">
            <div className="container mx-auto px-6 flex justify-between items-center">
            <div>
              Días de atención: Lunes 9:00 a.m. - 12 m. | WhatsApp:{' '}
              <a href="https://wa.me/+50763843474/?text=Hola%20Junta%20Comunal%20David%20Sur" target="_blank" rel="noopener noreferrer" className="hover:underline">
                +507 6384-3474
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/reportes" className="bg-white text-[#254A39] px-3 py-1 rounded-md font-medium hover:bg-gray-100 transition">
                Reportes
              </Link>
              <a href="https://www.instagram.com/juntacomunaldavidsur/" target="_blank" rel="noopener noreferrer">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
            </div>
        </div>}

        {/* Main Navbar - shrinks on scroll */}
        <div className={`container mx-auto px-6 flex justify-between items-center transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
          <Link href="/">
            <img 
              src={scrolled ? "/images/logo-sticky.webp" : "/images/logo-blanco.webp"} 
              alt="Junta Comunal David Sur" 
              className={`transition-all duration-300 ${scrolled ? 'w-28' : 'w-40'}`} 
            />
          </Link>

          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            <Link href="/" className={scrolled ? 'text-gray-800 hover:text-[#254A39]' : 'text-white hover:text-gray-200'}>Inicio</Link>
            <Link href="/corregimiento" className={scrolled ? 'text-gray-800 hover:text-[#254A39]' : 'text-white hover:text-gray-200'}>Corregimiento</Link>
            <Link href="/transparencia" className={scrolled ? 'text-gray-800 hover:text-[#254A39]' : 'text-white hover:text-gray-200'}>Transparencia</Link>
            <Link href="/consulta-ciudadana" className={scrolled ? 'text-gray-800 hover:text-[#254A39]' : 'text-white hover:text-gray-200'}>Consulta Ciudadana</Link>
            <Link href="/noticias" className={scrolled ? 'text-gray-800 hover:text-[#254A39]' : 'text-white hover:text-gray-200'}>Noticias</Link>
          </nav>

          <button
            type="button"
            className="md:hidden block rounded-lg p-1.5 bg-[#254A39]"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <svg className="w-8 h-8" fill="none" stroke="#ffffff" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu - opens from RIGHT */}
      <div
        className={`fixed inset-0 bg-black/50 z-[600] transition-opacity duration-300 md:hidden ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      ></div>
      <aside
        id="mobile-navigation"
        className={`fixed inset-y-0 right-0 w-72 max-w-[85vw] bg-white z-[700] shadow-xl overflow-y-auto transition-transform duration-300 ease-out md:hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-hidden={!menuOpen}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <img src="/images/logo-sticky.webp" alt="Logo" className="w-32" />
            <button type="button" onClick={() => setMenuOpen(false)} className="text-gray-500 hover:text-gray-800" aria-label="Cerrar menú">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          
          <nav className="flex flex-col space-y-4 mb-8">
            <Link href="/" className="text-gray-800 font-medium hover:text-[#254A39]" onClick={() => setMenuOpen(false)}>Inicio</Link>
            <Link href="/corregimiento" className="text-gray-800 font-medium hover:text-[#254A39]" onClick={() => setMenuOpen(false)}>Corregimiento</Link>
            <Link href="/transparencia" className="text-gray-800 font-medium hover:text-[#254A39]" onClick={() => setMenuOpen(false)}>Transparencia</Link>
            <Link href="/consulta-ciudadana" className="text-gray-800 font-medium hover:text-[#254A39]" onClick={() => setMenuOpen(false)}>Consulta Ciudadana</Link>
            <Link href="/noticias" className="text-gray-800 font-medium hover:text-[#254A39]" onClick={() => setMenuOpen(false)}>Noticias</Link>
          </nav>

          <div className="border-t pt-6 space-y-4 text-sm text-gray-600">
            <p><strong>Días de atención:</strong><br/>Lunes 9:00 a.m. - 12 m.</p>
            <p><strong>WhatsApp:</strong><br/>
              <a href="https://wa.me/+50763843474/?text=Hola%20Junta%20Comunal%20David%20Sur" target="_blank" rel="noopener noreferrer" className="text-[#254A39] hover:underline">
                +507 6384-3474
              </a>
            </p>
            <Link href="/reportes" className="block text-center bg-[#254A39] text-white px-4 py-2 rounded-md font-medium" onClick={() => setMenuOpen(false)}>
              Reportes
            </Link>
            <a href="https://www.instagram.com/juntacomunaldavidsur/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-[#254A39]">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              <span>Síguenos en Instagram</span>
            </a>
          </div>
        </div>
      </aside>
    </>
  )
}
