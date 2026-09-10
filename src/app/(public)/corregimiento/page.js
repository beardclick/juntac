import PageHeader from '@/components/PageHeader'
import DatosCarousel from '@/components/DatosCarousel'

export const metadata = {
  title: 'Corregimiento | Junta Comunal de David Sur',
  description: 'David Sur, un corregimiento en crecimiento en la provincia de Chiriquí.',
}

export default function CorregimientoPage() {
  const barrios = [
    'San Cristóbal',
    'Villa Mercedes',
    'Lassonde',
    'La Riviera',
    'Victoriano Lorenzo',
    'El Retorno',
    'Ivu Primavera',
    'Urb. La Feria',
    'Nuevo Amanecer',
    'Los Abanicos'
  ]

  return (
    <>
      <PageHeader title="Corregimiento" breadcrumbs={[{ label: 'Corregimiento', href: '/corregimiento' }]} />

      {/* Description Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="space-y-6 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              David Sur, un corregimiento en crecimiento
            </h2>
            <div className="text-gray-700 leading-relaxed text-justify space-y-4 text-base md:text-lg">
              <p>
                David Sur es uno de los corregimientos que conforma el distrito de David, en la provincia de Chiriquí. Se caracteriza por ser un punto estratégico de desarrollo urbano y residencial, con una población activa y diversa que impulsa el crecimiento de la región.
              </p>
              <p>
                El corregimiento está conformado por distintos barrios y áreas que, en conjunto, forman una comunidad dinámica y llena de historia. Entre ellos destacan:
              </p>
            </div>
          </div>

          {/* Barrios Grid */}
          <div className="mb-20">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {barrios.map((barrio, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center font-semibold text-gray-800 hover:border-[#254A39] hover:bg-[#254A39]/5 transition-all shadow-sm">
                  <span className="text-xs text-[#254A39] block font-bold mb-1">Comunidad</span>
                  {barrio}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Datos Curiosos Section (Carousel with datos1..7.jpg) */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Datos Curiosos de David Sur
            </h2>
            <p className="text-gray-600 mt-2">
              Conoce más sobre la historia, gente y cultura de nuestro corregimiento.
            </p>
          </div>
          <DatosCarousel />
        </div>
      </section>

      {/* Tu Corregimiento Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16">
            Tu Corregimiento
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Fundación */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 shadow-sm space-y-2">
              <div className="w-12 h-12 rounded-xl bg-[#254A39]/10 text-[#254A39] flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Fundación:</h3>
              <p className="text-gray-600">David Sur se fundó 14 de febrero 2018</p>
            </div>

            {/* Cabecera */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 shadow-sm space-y-2">
              <div className="w-12 h-12 rounded-xl bg-[#254A39]/10 text-[#254A39] flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Cabecera:</h3>
              <p className="text-gray-600">San Cristóbal</p>
            </div>

            {/* Misión */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 shadow-sm space-y-2">
              <h3 className="text-xl font-bold text-[#254A39] mb-2">Misión</h3>
              <p className="text-gray-700 leading-relaxed text-justify">
                Impulsar el bienestar y desarrollo de la comunidad de David Sur mediante proyectos sociales, culturales y de infraestructura, con transparencia y participación ciudadana.
              </p>
            </div>

            {/* Visión */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 shadow-sm space-y-2">
              <h3 className="text-xl font-bold text-[#254A39] mb-2">Visión</h3>
              <p className="text-gray-700 leading-relaxed text-justify">
                Ser una Junta Comunal referente en gestión comunitaria, reconocida por construir un corregimiento organizado, solidario y próspero.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
