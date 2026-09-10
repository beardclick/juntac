import './globals.css'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata = {
  title: 'Junta Comunal de David Sur',
  description: 'Página oficial de la Junta Comunal de David Sur. Proyectos, noticias, actos públicos e iniciativas para el corregimiento.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={poppins.variable}>
      <body className="font-poppins">{children}</body>
    </html>
  )
}
