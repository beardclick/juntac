export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background images: desktop vs mobile */}
      <picture className="absolute inset-0 w-full h-full">
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
      <div className="relative z-20 container mx-auto px-6 text-center max-w-4xl py-24">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-md">
          Junta Comunal David Sur
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto leading-relaxed drop-shadow">
          David Sur: un corregimiento en crecimiento, con visión comunitaria y compromiso con sus ciudadanos.
        </p>
      </div>

      {/* Grafico at bottom full width */}
      <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none">
        <img
          src="/images/grafico.png"
          alt="Decoración David Sur"
          className="w-full h-auto object-cover opacity-90"
        />
      </div>
    </section>
  )
}
