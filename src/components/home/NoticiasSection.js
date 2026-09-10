'use client'
import Link from 'next/link'
import NewsCard from '../NewsCard'

export default function NoticiasSection({ noticias }) {
  // Use mock data if no noticias provided
  const displayNoticias = noticias?.length > 0 ? noticias : [
    { id: 1, title: 'Inician trabajos de parcheo en San Cristóbal', slug: 'inician-trabajos-parcheo', excerpt: 'La Junta Comunal ha dado inicio a los trabajos de reparación vial en las principales calles.', published_at: '2026-08-15', categories: { name: 'Comunidad' } },
    { id: 2, title: 'Jornada de limpieza en Parque de La Riviera', slug: 'jornada-limpieza-parque', excerpt: 'Vecinos se unieron a nuestro equipo para embellecer las áreas verdes de La Riviera.', published_at: '2026-08-10', categories: { name: 'Medio Ambiente' } },
    { id: 3, title: 'Entrega de apoyos sociales', slug: 'entrega-apoyos-sociales', excerpt: 'Más de 50 familias se beneficiaron con la entrega de insumos de primera necesidad.', published_at: '2026-08-05', categories: { name: 'Social' } },
    { id: 4, title: 'Nuevas luminarias instaladas', slug: 'nuevas-luminarias', excerpt: 'Avanzamos con el programa de iluminación para brindar mayor seguridad a nuestros residentes.', published_at: '2026-08-01', categories: { name: 'Infraestructura' } }
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Últimas Noticias</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {displayNoticias.map((noticia) => (
            <NewsCard 
              key={noticia.id}
              title={noticia.title}
              slug={noticia.slug}
              excerpt={noticia.excerpt}
              featured_image={noticia.featured_image}
              category={noticia.categories?.name || 'General'}
              published_at={noticia.published_at}
            />
          ))}
        </div>

        <div className="text-center">
          <Link 
            href="/noticias" 
            className="inline-block px-8 py-3 bg-[#254A39] text-white rounded-md font-semibold hover:bg-[#1a3829] transition-colors shadow-md hover:shadow-lg"
          >
            Ver Todas las Noticias
          </Link>
        </div>
      </div>
    </section>
  )
}
