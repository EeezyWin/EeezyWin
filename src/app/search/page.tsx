import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { toUrlSegment } from '@/lib/slugify'
import SearchBar from '@/components/layout/SearchBar'

export const dynamic = 'force-dynamic'

interface SearchPageProps {
  searchParams: { q?: string }
}

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
  const q = searchParams.q?.trim() ?? ''
  return {
    title: q
      ? `Search results for "${q}" — Psychedelic Beacon`
      : 'Search Clinics — Psychedelic Beacon',
    description:
      'Search for ketamine infusion clinics and psychedelic therapy providers near you.',
    robots: { index: false },
  }
}

interface ClinicResult {
  slug: string
  name: string
  city: string
  state: string
  state_code: string
  primary_modality: string | null
  verification_status: string
  photo: string | null
  address: string | null
  phone: string | null
}

const SELECT_FIELDS =
  'slug, name, city, state, state_code, primary_modality, verification_status, photo, address, phone'

async function search(q: string): Promise<ClinicResult[]> {
  if (!q || q.length < 2) return []

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Strategy 1: Full-text search — fast, ranked, handles stemming
  const { data: ftsData } = await supabase
    .from('clinics')
    .select(SELECT_FIELDS)
    .textSearch('search_vector', q, { type: 'websearch', config: 'english' })
    .limit(30)

  if (ftsData && ftsData.length > 0) {
    return ftsData
  }

  // Strategy 2: Per-word ilike across name, city, state, modality
  // Splitting "white plains" into ["white","plains"] means both words match
  // their respective parts of "White Plains, NY"
  const words = q.split(/\s+/).filter(Boolean)
  const conditions = words
    .flatMap((word) => [
      `name.ilike.%${word}%`,
      `city.ilike.%${word}%`,
      `state.ilike.%${word}%`,
      `primary_modality.ilike.%${word}%`,
    ])
    .join(',')

  const { data: ilikeData } = await supabase
    .from('clinics')
    .select(SELECT_FIELDS)
    .or(conditions)
    .limit(30)

  return ilikeData ?? []
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const q = searchParams.q?.trim() ?? ''
  const results = await search(q)

  return (
    <>
      {/* Header bar */}
      <section className="gradient-hero py-10">
        <div className="container-narrow">
          <h1 className="text-3xl font-bold text-white mb-5 text-center">
            {q ? `Results for "${q}"` : 'Search Clinics'}
          </h1>
          <div className="max-w-xl mx-auto">
            <SearchBar large placeholder="Search city, clinic name, or treatment type…" />
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="container-narrow py-10">
        {!q && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-neutral-500 text-lg">
              Enter a city, clinic name, or treatment type above to search.
            </p>
            <Link
              href="/clinics"
              className="inline-block mt-6 px-6 py-3 bg-teal text-white font-semibold rounded-xl hover:bg-teal-dark transition-colors"
            >
              Browse All States
            </Link>
          </div>
        )}

        {q && results.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-neutral-700 text-lg font-semibold mb-2">No results found for &ldquo;{q}&rdquo;</p>
            <p className="text-neutral-500 mb-6">Try a different city, state, or treatment type.</p>
            <Link
              href="/clinics"
              className="inline-block px-6 py-3 bg-teal text-white font-semibold rounded-xl hover:bg-teal-dark transition-colors"
            >
              Browse All States
            </Link>
          </div>
        )}

        {q && results.length > 0 && (
          <>
            <p className="text-sm text-neutral-500 mb-6">
              {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{q}&rdquo;
            </p>
            <div className="space-y-4">
              {results.map((clinic) => {
                const stateParam = toUrlSegment(clinic.state)
                return (
                  <Link
                    key={clinic.slug}
                    href={`/provider/${clinic.slug}`}
                    className="group flex items-start gap-4 p-5 bg-white rounded-xl border border-neutral-200 shadow-sm hover:border-teal hover:shadow-card-hover transition-all duration-200"
                  >
                    {/* Icon / photo */}
                    <div className="shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-teal/10 flex items-center justify-center">
                      {clinic.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={clinic.photo}
                          alt={clinic.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg className="w-7 h-7 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <h2 className="font-semibold text-neutral-900 group-hover:text-teal transition-colors leading-snug">
                          {clinic.name}
                        </h2>
                        {clinic.verification_status === 'VERIFIED' && (
                          <span className="shrink-0 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-500 mt-1">
                        <Link
                          href={`/clinics/${stateParam}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-teal transition-colors"
                        >
                          {clinic.city}, {clinic.state_code}
                        </Link>
                        {clinic.primary_modality && (
                          <span> &middot; {clinic.primary_modality}</span>
                        )}
                      </p>
                      {clinic.address && (
                        <p className="text-xs text-neutral-400 mt-1 truncate">{clinic.address}</p>
                      )}
                    </div>

                    <svg
                      className="w-4 h-4 text-neutral-300 group-hover:text-teal transition-colors shrink-0 mt-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )
              })}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/clinics"
                className="inline-flex items-center gap-2 text-teal font-medium hover:text-teal-dark transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Browse all states
              </Link>
            </div>
          </>
        )}
      </section>
    </>
  )
}
