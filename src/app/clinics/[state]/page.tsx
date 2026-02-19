import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { createStaticClient } from '@/lib/supabase/static'
import { toUrlSegment } from '@/lib/slugify'
import StateHero from '@/components/state/StateHero'
import CityGrid from '@/components/state/CityGrid'
import type { CityCount } from '@/types/clinic'

export const revalidate = 86400

interface Params {
  state: string
}

export async function generateStaticParams(): Promise<Params[]> {
  const supabase = createStaticClient()
  const { data } = await supabase
    .from('clinics')
    .select('state, state_code')
    .order('state')

  const seen = new Set<string>()
  const params: Params[] = []
  for (const row of data ?? []) {
    const seg = toUrlSegment(row.state)
    if (!seen.has(seg)) {
      seen.add(seg)
      params.push({ state: seg })
    }
  }
  return params
}

async function getStateData(stateParam: string) {
  const supabase = createClient()

  // Find matching state (compare URL param to slugified state name)
  const { data: allStates } = await supabase
    .from('clinics')
    .select('state, state_code')
    .order('state')

  const stateRow = (allStates ?? []).find(
    (r) => toUrlSegment(r.state) === stateParam
  )
  if (!stateRow) return null

  // Get city counts
  const { data: cities } = await supabase
    .from('clinics')
    .select('city, state, state_code')
    .eq('state_code', stateRow.state_code)
    .order('city')

  if (!cities) return null

  // Aggregate city counts
  const cityMap = new Map<string, CityCount>()
  for (const row of cities) {
    const existing = cityMap.get(row.city)
    if (existing) {
      existing.count++
    } else {
      cityMap.set(row.city, {
        city: row.city,
        state: row.state,
        state_code: row.state_code,
        count: 1,
      })
    }
  }

  const cityList = Array.from(cityMap.values()).sort((a, b) => b.count - a.count)
  const totalClinics = cityList.reduce((sum, c) => sum + c.count, 0)

  return {
    stateName: stateRow.state,
    stateCode: stateRow.state_code,
    cities: cityList,
    totalClinics,
  }
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const data = await getStateData(params.state)
  if (!data) return {}

  return {
    title: `Ketamine Clinics in ${data.stateName} — ${data.totalClinics} Providers`,
    description: `Find verified ketamine therapy and psychedelic therapy providers in ${data.stateName}. Browse ${data.totalClinics} clinics across ${data.cities.length} cities.`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/clinics/${params.state}`,
    },
  }
}

export default async function StatePage({ params }: { params: Params }) {
  const data = await getStateData(params.state)
  if (!data) notFound()

  return (
    <>
      <StateHero
        stateName={data.stateName}
        cityCount={data.cities.length}
        clinicCount={data.totalClinics}
      />
      <CityGrid cities={data.cities} stateParam={params.state} />
    </>
  )
}
