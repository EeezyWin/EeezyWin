import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { toUrlSegment } from '@/lib/slugify'

interface CityHeroProps {
  city: string
  state: string
  stateCode: string
  stateParam: string
  count: number
}

export default function CityHero({ city, state, stateCode, stateParam, count }: CityHeroProps) {
  return (
    <section className="gradient-hero py-14">
      <div className="container-narrow">
        <Breadcrumbs
          light
          items={[
            { label: 'Home', href: '/' },
            { label: state, href: `/clinics/${stateParam}` },
            { label: city },
          ]}
          className="mb-6"
        />
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
          Ketamine Clinics in {city}, {stateCode}
        </h1>
        <p className="text-teal-100 text-lg">
          {count} {count === 1 ? 'provider' : 'providers'} found in {city}, {state}
        </p>
      </div>
    </section>
  )
}
