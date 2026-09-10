'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

export default function DatosCarousel() {
  const images = [
    '/images/datos1.jpg',
    '/images/datos2.jpg',
    '/images/datos3.jpg',
    '/images/datos4.jpg',
    '/images/datos5.jpg',
    '/images/datos6.jpg',
    '/images/datos7.jpg',
  ]

  return (
    <div className="w-full relative pb-12">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        loop={true}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="datos-swiper rounded-xl overflow-hidden"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="w-full rounded-xl overflow-hidden shadow-md bg-white">
              <img 
                src={src} 
                alt={`Dato curioso ${index + 1}`} 
                className="w-full h-auto object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
