import Hero from '../components/layout/Hero'
import Trust from '@/components/layout/Trust'
import Tools from '@/components/layout/Tools'
import HowItWorks from '@/components/layout/HowItWorks'
import Footer from '@/components/layout/Footer'


export default function Home() {
  return (
    <div className="space-y-24">
      <Hero />
      <Trust />
      <Tools />
      <HowItWorks />
      <Footer />
    </div>
  )
}
