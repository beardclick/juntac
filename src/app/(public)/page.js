import HeroSection from '@/components/home/HeroSection'
import DavidSurSection from '@/components/home/DavidSurSection'
import RepresentanteSection from '@/components/home/RepresentanteSection'
import ValoresSection from '@/components/home/ValoresSection'
import CtaSection from '@/components/home/CtaSection'
import NoticiasSection from '@/components/home/NoticiasSection'
import { getNews } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const { news } = await getNews({ limit: 4 })

  return (
    <>
      <HeroSection />
      <DavidSurSection />
      <RepresentanteSection />
      <ValoresSection />
      <CtaSection />
      <NoticiasSection noticias={news} />
    </>
  )
}
