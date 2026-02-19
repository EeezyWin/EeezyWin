import HeroSection from '@/components/home/HeroSection'
import ValueProps from '@/components/home/ValueProps'
import FeaturedCities from '@/components/home/FeaturedCities'
import HowItWorks from '@/components/home/HowItWorks'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ValueProps />
      <FeaturedCities />
      <HowItWorks />
    </>
  )
}
