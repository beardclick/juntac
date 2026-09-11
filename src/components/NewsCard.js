import Link from 'next/link'

export default function NewsCard({ title, slug, excerpt, featured_image, category, published_at }) {
  // Format date
  const dateObj = new Date(published_at)
  const formattedDate = dateObj.toLocaleDateString('es-PA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow group flex flex-col sm:flex-row h-full">
      {/* Image Side */}
      <Link href={`/noticias/${slug}`} className="sm:w-2/5 relative overflow-hidden h-48 sm:h-auto shrink-0 block" aria-label={title}>
        {featured_image ? (
          <img 
            src={featured_image} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#254A39] to-[#2d5a46] flex items-center justify-center text-white opacity-80 group-hover:scale-105 transition-transform duration-500">
            <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5L18.5 7H20M9 11h4m-4 4h4m-4-8h4"/></svg>
          </div>
        )}
      </Link>

      {/* Content Side */}
      <div className="p-6 flex flex-col justify-center sm:w-3/5">
        <div className="flex items-center space-x-3 mb-3">
          <span className="bg-[#254A39]/10 text-[#254A39] text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
            {category}
          </span>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
        
        <Link href={`/noticias/${slug}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#254A39] transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        
        <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed">
          {excerpt}
        </p>
      </div>
    </div>
  )
}
