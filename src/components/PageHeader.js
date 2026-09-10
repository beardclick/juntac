import Link from 'next/link'

export default function PageHeader({ title, breadcrumbs }) {
  return (
    <div className="bg-[#254A39] pt-32 pb-16 px-6 text-white text-center relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{title}</h1>
        
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex justify-center items-center space-x-2 text-sm font-medium text-gray-300">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            
            {breadcrumbs.map((crumb, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <svg className="w-4 h-4 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                {idx === breadcrumbs.length - 1 ? (
                  <span className="text-white">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-white transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        )}
      </div>
    </div>
  )
}
