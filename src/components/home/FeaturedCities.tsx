import Link from 'next/link'
import { toUrlSegment } from '@/lib/slugify'

const FEATURED_CITIES = [
  { city: 'New York', state: 'New York', stateCode: 'NY', count: 101, emoji: '🗽' },
  { city: 'Los Angeles', state: 'California', stateCode: 'CA', count: 22, emoji: '🌴' },
  { city: 'Denver', state: 'Colorado', stateCode: 'CO', count: 12, emoji: '🏔️' },
  { city: 'Austin', state: 'Texas', stateCode: 'TX', count: 10, emoji: '🤠' },
  { city: 'Portland', state: 'Oregon', stateCode: 'OR', count: 9, emoji: '🌲' },
  { city: 'Las Vegas', state: 'Nevada', stateCode: 'NV', count: 8, emoji: '🎰' },
  { city: 'Seattle', state: 'Washington', stateCode: 'WA', count: 8, emoji: '🌧️' },
  { city: 'Atlanta', state: 'Georgia', stateCode: 'GA', count: 7, emoji: '🍑' },
]

export default function FeaturedCities() {
  return (
    <section className="bg-neutral-50 py-20">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            Browse by City
          </h2>
          <p className="text-lg text-neutral-500">
            Clinics in major metro areas across the United States
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {FEATURED_CITIES.map(({ city, state, stateCode, count, emoji }) => (
            <Link
              key={`${city}-${stateCode}`}
              href={`/clinics/${toUrlSegment(state)}/${toUrlSegment(city)}`}
              className="group flex flex-col p-5 bg-white rounded-2xl border border-neutral-200 hover:border-teal-300 hover:shadow-card-hover transition-all duration-200"
            >
              <span className="text-2xl mb-3">{emoji}</span>
              <span className="font-bold text-neutral-900 group-hover:text-teal transition-colors text-sm">
                {city}
              </span>
              <span className="text-xs text-neutral-500 mt-0.5">{state}</span>
              <span className="mt-3 text-xs font-semibold text-teal bg-teal-50 px-2 py-0.5 rounded-full self-start">
                {count}+ clinics
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/clinics/new-york"
            className="inline-flex items-center gap-2 text-teal font-semibold hover:text-teal-dark transition-colors"
          >
            View all states
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
