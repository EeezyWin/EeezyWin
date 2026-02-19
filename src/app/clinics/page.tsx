import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { toUrlSegment } from '@/lib/slugify'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Browse Ketamine & Psychedelic Therapy Clinics — All States',
  description:
    'Find verified ketamine infusion clinics and psychedelic therapy providers near you. Browse 596+ listings across 34 US states.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/clinics`,
  },
}

interface StateRow {
  state: string
  state_code: string
  count: number
}

async function getAllStates(): Promise<StateRow[]> {
  const supabase = createClient()

  const { data } = await supabase
    .from('clinics')
    .select('state, state_code')
    .order('state')

  if (!data) return []

  // Aggregate counts by state
  const stateMap = new Map<string, StateRow>()
  for (const row of data) {
    const existing = stateMap.get(row.state_code)
    if (existing) {
      existing.count++
    } else {
      stateMap.set(row.state_code, {
        state: row.state,
        state_code: row.state_code,
        count: 1,
      })
    }
  }

  return Array.from(stateMap.values()).sort((a, b) =>
    a.state.localeCompare(b.state)
  )
}

export default async function ClinicsIndexPage() {
  const states = await getAllStates()
  const totalClinics = states.reduce((sum, s) => sum + s.count, 0)

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero py-14">
        <div className="container-narrow text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Browse All Clinics
          </h1>
          <p className="text-lg text-teal-100 max-w-2xl mx-auto">
            {totalClinics}+ verified ketamine &amp; psychedelic therapy providers across{' '}
            {states.length} states. Select a state to explore clinics near you.
          </p>
        </div>
      </section>

      {/* State grid */}
      <section className="container-narrow py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {states.map((s) => {
            const stateParam = toUrlSegment(s.state)
            return (
              <Link
                key={s.state_code}
                href={`/clinics/${stateParam}`}
                className="group flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-200 shadow-sm hover:border-teal hover:shadow-card-hover transition-all duration-200"
              >
                <div>
                  <p className="font-semibold text-neutral-900 group-hover:text-teal transition-colors">
                    {s.state}
                  </p>
                  <p className="text-sm text-neutral-500 mt-0.5">
                    {s.count} {s.count === 1 ? 'clinic' : 'clinics'}
                  </p>
                </div>
                <svg
                  className="w-4 h-4 text-neutral-300 group-hover:text-teal transition-colors shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}
