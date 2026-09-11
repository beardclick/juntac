import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#254A39] via-[#1a3829] to-[#0f2219] p-6">
      <div className="text-center text-white max-w-md">
        <p className="text-8xl font-extrabold drop-shadow-lg leading-none">404</p>
        <h1 className="text-2xl font-bold mt-4">Página no encontrada</h1>
        <p className="text-gray-300 mt-3">
          Lo sentimos, la página que buscas no existe o fue movida.
        </p>
        <Link
          href="/"
          className="inline-block mt-8 px-8 py-3 bg-white text-[#254A39] font-bold rounded-lg hover:bg-gray-100 transition shadow-lg"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  )
}
