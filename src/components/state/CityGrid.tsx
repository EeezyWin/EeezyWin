import Link from 'next/link'
import { toUrlSegment } from '@/lib/slugify'
import type { CityCount } from '@/types/clinic'

interface CityGridProps {
  cities: CityCount[]
  stateParam: string
}

export default function CityGrid({ cities, stateParam }: CityGridProps) {
  return (
    <section className="container-narrow py-12">
      <h2 className="text-2xl font-bold text-neutral-900 mb-8">
        Browse by City
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {cities.map(({ city, count }) => (
          <Link
            key={city}
            href={`/clinics/${stateParam}/${toUrlSegment(city)}`}
            className="group flex flex-col p-5 bg-white rounded-2xl border border-neutral-200 hover:border-teal-300 hover:shadow-card-hover transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="font-bold text-neutral-900 group-hover:text-teal transition-colors text-sm leading-tight">
                {city}
              </span>
            </div>
            <span className="text-xs font-semibold text-teal bg-teal-50 px-2 py-0.5 rounded-full self-start mt-auto">
              {count} {count === 1 ? 'clinic' : 'clinics'}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
