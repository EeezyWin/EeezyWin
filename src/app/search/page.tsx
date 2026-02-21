import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import SearchBar from '@/components/layout/SearchBar'
import MapWrapper from '@/components/map/MapWrapper'
import { isZipCode, haversineDistance } from '@/lib/haversine'
import { toMapClinics } from '@/lib/clinic'
import type { MapClinic } from '@/lib/clinic'

export const dynamic = 'force-dynamic'

interface SearchPageProps {
  searchParams: { q?: string; radius?: string; lat?: string; lng?: string }
}

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
  const q = searchParams.q?.trim() ?? ''
  const hasGeo = searchParams.lat && searchParams.lng
  return {
    title: hasGeo
      ? 'Clinics Near You — Psychedelic Beacon'
      : q
      ? `Search results for "${q}" — Psychedelic Beacon`
      : 'Search Clinics — Psychedelic Beacon',
    description:
      'Search for ketamine infusion clinics and psychedelic therapy providers near you.',
    robots: { index: false },
  }
}

// ─── Types ──────────────────────────────────────────────────────────────────

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
  latitude: number | null
  longitude: number | null
  rating: number | null
  reviews: number | null
}

interface ZipResult extends ClinicResult {
  distance: number
}

interface GeoPoint {
  lat: number
  lng: number
  city: string
  state: string
  stateCode: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const SELECT_FIELDS =
  'slug, name, city, state, state_code, primary_modality, verification_status, photo, address, phone, latitude, longitude, rating, reviews'

const VALID_RADII = [10, 25, 50, 100] as const
type Radius = (typeof VALID_RADII)[number]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseRadius(raw: string | undefined): Radius {
  const n = parseInt(raw ?? '25', 10)
  return VALID_RADII.includes(n as Radius) ? (n as Radius) : 25
}

function latDelta(miles: number): number {
  return miles / 69.0
}

function lngDelta(miles: number, lat: number): number {
  return miles / (69.0 * Math.cos((lat * Math.PI) / 180))
}

// ─── Search by raw lat/lng (from browser geolocation) ────────────────────────

async function searchByLatLng(
  lat: number,
  lng: number,
  radius: Radius
): Promise<ZipResult[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const dLat = latDelta(radius * 1.1)
  const dLng = lngDelta(radius * 1.1, lat)

  const { data } = await supabase
    .from('clinics')
    .select(SELECT_FIELDS)
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .gte('latitude', lat - dLat)
    .lte('latitude', lat + dLat)
    .gte('longitude', lng - dLng)
    .lte('longitude', lng + dLng)
    .limit(200)

  if (!data) return []

  return data
    .map((c) => ({
      ...(c as ClinicResult),
      distance: haversineDistance(lat, lng, c.latitude!, c.longitude!),
    }))
    .filter((c) => c.distance <= radius)
    .sort((a, b) => a.distance - b.distance)
}

// ─── Geocode zip via our own API route ───────────────────────────────────────

async function geocodeZip(zip: string): Promise<GeoPoint | null> {
  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'http://localhost:3000'
    const res = await fetch(`${siteUrl}/api/geocode-zip?zip=${zip}`, {
      next: { revalidate: 86400 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// ─── Zip search: bounding box → Haversine sort ───────────────────────────────

async function searchByZip(
  zip: string,
  radius: Radius
): Promise<{ results: ZipResult[]; geo: GeoPoint | null }> {
  const geo = await geocodeZip(zip)
  if (!geo) return { results: [], geo: null }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const dLat = latDelta(radius * 1.1)
  const dLng = lngDelta(radius * 1.1, geo.lat)

  const { data } = await supabase
    .from('clinics')
    .select(SELECT_FIELDS)
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .gte('latitude', geo.lat - dLat)
    .lte('latitude', geo.lat + dLat)
    .gte('longitude', geo.lng - dLng)
    .lte('longitude', geo.lng + dLng)
    .limit(200)

  if (!data) return { results: [], geo }

  const withDistance: ZipResult[] = data
    .map((c) => ({
      ...(c as ClinicResult),
      distance: haversineDistance(geo.lat, geo.lng, c.latitude!, c.longitude!),
    }))
    .filter((c) => c.distance <= radius)
    .sort((a, b) => a.distance - b.distance)

  return { results: withDistance, geo }
}

// ─── Text search: FTS then ilike fallback ────────────────────────────────────

async function searchByText(q: string): Promise<ClinicResult[]> {
  if (!q || q.length < 2) return []

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: ftsData } = await supabase
    .from('clinics')
    .select(SELECT_FIELDS)
    .textSearch('search_vector', q, { type: 'websearch', config: 'english' })
    .limit(30)

  if (ftsData && ftsData.length > 0) return ftsData as ClinicResult[]

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

  return (ilikeData ?? []) as ClinicResult[]
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const q = searchParams.q?.trim() ?? ''
  const radius = parseRadius(searchParams.radius)
  const isZip = isZipCode(q)
  const geoLat = searchParams.lat ? parseFloat(searchParams.lat) : null
  const geoLng = searchParams.lng ? parseFloat(searchParams.lng) : null
  const isGeoSearch = geoLat !== null && geoLng !== null && !isNaN(geoLat) && !isNaN(geoLng)

  let textResults: ClinicResult[] = []
  let zipResults: ZipResult[] = []
  let geo: GeoPoint | null = null

  if (isGeoSearch) {
    zipResults = await searchByLatLng(geoLat!, geoLng!, radius)
  } else if (q) {
    if (isZip) {
      const found = await searchByZip(q, radius)
      zipResults = found.results
      geo = found.geo
    } else {
      textResults = await searchByText(q)
    }
  }

  const isProximitySearch = isZip || isGeoSearch
  const results = isProximitySearch ? zipResults : textResults
  const mapClinics: MapClinic[] = isProximitySearch
    ? zipResults
        .filter((c) => c.latitude !== null && c.longitude !== null)
        .map((c) => ({
          slug: c.slug,
          name: c.name,
          city: c.city,
          state_code: c.state_code,
          lat: c.latitude!,
          lng: c.longitude!,
          verification_status: c.verification_status,
          rating: c.rating,
        }))
    : toMapClinics(textResults as Parameters<typeof toMapClinics>[0])

  const mapCenter: [number, number] | undefined = isGeoSearch
    ? [geoLat!, geoLng!]
    : geo
    ? [geo.lat, geo.lng]
    : undefined

  return (
    <>
      {/* Header */}
      <section className="gradient-hero py-10">
        <div className="container-narrow">
          <h1 className="text-3xl font-bold text-white mb-5 text-center">
            {isGeoSearch
              ? `Clinics Near You`
              : q
              ? isZip
                ? `Clinics near ${q}${geo ? ` (${geo.city}, ${geo.stateCode})` : ''}`
                : `Results for "${q}"`
              : 'Search Clinics'}
          </h1>
          <div className="max-w-xl mx-auto">
            <SearchBar large placeholder="Search city, clinic name, zip code, or treatment…" />
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="container-narrow py-10">

        {/* ── Empty state: no query ─────────────────────────── */}
        {!q && !isGeoSearch && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-neutral-500 text-lg">
              Enter a city, clinic name, zip code, or treatment type above to search.
            </p>
            <Link
              href="/clinics"
              className="inline-block mt-6 px-6 py-3 bg-teal text-white font-semibold rounded-xl hover:bg-teal-dark transition-colors"
            >
              Browse All States
            </Link>
          </div>
        )}

        {/* ── Zip: geocoding failed ─────────────────────────── */}
        {q && isZip && !geo && !isGeoSearch && (
          <div className="text-center py-16">
            <p className="text-neutral-700 text-lg font-semibold mb-2">Couldn&rsquo;t find zip code &ldquo;{q}&rdquo;</p>
            <p className="text-neutral-500 mb-6">Try a city name or clinic name instead.</p>
            <Link href="/clinics" className="inline-block px-6 py-3 bg-teal text-white font-semibold rounded-xl hover:bg-teal-dark transition-colors">
              Browse All States
            </Link>
          </div>
        )}

        {/* ── No results ───────────────────────────────────── */}
        {(q || isGeoSearch) && results.length === 0 && (!isZip || geo || isGeoSearch) && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-neutral-700 text-lg font-semibold mb-2">
              No clinics found {isGeoSearch ? `within ${radius} miles of your location` : isZip ? `within ${radius} miles of ${q}` : `for "${q}"`}
            </p>
            {(isZip || isGeoSearch) && (
              <p className="text-neutral-500 mb-4">Try expanding your search radius.</p>
            )}
            {!isZip && !isGeoSearch && (
              <p className="text-neutral-500 mb-4">Try a different city, state, or treatment type.</p>
            )}
            <Link href="/clinics" className="inline-block px-6 py-3 bg-teal text-white font-semibold rounded-xl hover:bg-teal-dark transition-colors">
              Browse All States
            </Link>
          </div>
        )}

        {/* ── Results ──────────────────────────────────────── */}
        {(q || isGeoSearch) && results.length > 0 && (
          <>
            {/* Meta row: count + radius pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <p className="text-sm text-neutral-500">
                {results.length} clinic{results.length !== 1 ? 's' : ''}
                {isGeoSearch
                  ? ` within ${radius} miles of your location`
                  : isZip
                  ? ` within ${radius} miles of ${q}`
                  : ` for "${q}"`}
              </p>

              {/* Radius selector — only for zip/geo searches */}
              {(isZip || isGeoSearch) && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-neutral-400 mr-1">Radius:</span>
                  {VALID_RADII.map((r) => (
                    <Link
                      key={r}
                      href={
                        isGeoSearch
                          ? `/search?lat=${geoLat}&lng=${geoLng}&radius=${r}`
                          : `/search?q=${encodeURIComponent(q)}&radius=${r}`
                      }
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        r === radius
                          ? 'bg-teal text-white border-teal'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:border-teal hover:text-teal'
                      }`}
                    >
                      {r} mi
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop: list + map side-by-side; Mobile: list then map */}
            <div className={isProximitySearch && mapClinics.length > 0 ? 'lg:flex lg:gap-6 lg:items-start' : ''}>

              {/* Clinic list */}
              <div className={isProximitySearch && mapClinics.length > 0 ? 'lg:flex-1 lg:min-w-0' : ''}>
                <div className="space-y-4">
                  {results.map((clinic) => {
                    const zipClinic = isZip ? (clinic as ZipResult) : null
                    return (
                      <Link
                        key={clinic.slug}
                        href={`/provider/${clinic.slug}`}
                        className="group flex items-start gap-4 p-5 bg-white rounded-xl border border-neutral-200 shadow-sm hover:border-teal hover:shadow-md transition-all duration-200"
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
                            <div className="flex items-center gap-2 shrink-0 flex-wrap">
                              {zipClinic && (
                                <span className="text-xs font-medium text-teal bg-teal/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                                  {zipClinic.distance < 1
                                    ? `< 1 mi`
                                    : `${zipClinic.distance.toFixed(1)} mi`}
                                </span>
                              )}
                              {clinic.verification_status === 'VERIFIED' && (
                                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                                  Verified
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-neutral-500 mt-1">
                            <span>{clinic.city}, {clinic.state_code}</span>
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

                {/* Mobile map: shown below list on small screens */}
                {isProximitySearch && mapClinics.length > 0 && (
                  <div className="lg:hidden mt-6">
                    <MapWrapper
                      clinics={mapClinics}
                      center={mapCenter}
                      zoom={11}
                      className="h-[350px]"
                    />
                  </div>
                )}

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
              </div>

              {/* Desktop map: sticky sidebar, only shown for proximity searches */}
              {isProximitySearch && mapClinics.length > 0 && (
                <div className="hidden lg:block w-[420px] shrink-0 sticky top-20 self-start">
                  <MapWrapper
                    clinics={mapClinics}
                    center={mapCenter}
                    zoom={11}
                    className="h-[600px]"
                  />
                  <div className="mt-3 flex items-center gap-4 text-xs text-neutral-500 justify-center">
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block w-3 h-3 rounded-sm bg-teal" />
                      Verified
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block w-3 h-3 rounded-sm bg-gold" />
                      Other
                    </span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </>
  )
}
