import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#254A39] text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Col 1 */}
          <div>
            <img src="/images/logo-blanco.webp" alt="Logo Junta Comunal" className="w-48 mb-6" />
            <p className="text-gray-300 text-sm leading-relaxed">
              La Junta Comunal de David Sur trabaja día a día por el bienestar de todos sus residentes.
            </p>
          </div>
          
          {/* Col 2 */}
          <div>
            <h3 className="text-xl font-bold mb-6">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              <li><Link href="/corregimiento" className="text-gray-300 hover:text-white transition">Corregimiento</Link></li>
              <li><Link href="/transparencia" className="text-gray-300 hover:text-white transition">Transparencia</Link></li>
              <li><Link href="/reportes" className="text-gray-300 hover:text-white transition">Reportes</Link></li>
              <li><Link href="/noticias" className="text-gray-300 hover:text-white transition">Noticias</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h3 className="text-xl font-bold mb-6">Redes Sociales</h3>
            <a href="https://www.instagram.com/juntacomunaldavidsur/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-gray-300 hover:text-white transition">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              <span>Síguenos en Instagram</span>
            </a>
          </div>
        </div>

        <div className="border-t border-gray-600 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div className="mb-4 md:mb-0">
            <a href="https://nic.pa/es" target="_blank" rel="noopener noreferrer">
              <img src="/images/nic.png" alt="NIC Panamá" className="h-8 opacity-75 hover:opacity-100 transition" />
            </a>
          </div>
          <div className="text-center md:text-right">
            © 2026 - Junta Comunal de David Sur. <br className="md:hidden" />
            Desarrollado por <a href="https://beardclick.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Beard Click Design</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
