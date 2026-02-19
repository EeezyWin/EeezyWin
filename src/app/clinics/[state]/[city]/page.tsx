import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import Script from 'next/script'
import { createClient } from '@/lib/supabase/server'
import { createStaticClient } from '@/lib/supabase/static'
import { toUrlSegment } from '@/lib/slugify'
import { buildFAQSchema, buildBreadcrumbSchema } from '@/lib/schema-markup'
import CityHero from '@/components/city/CityHero'
import FilterBar from '@/components/city/FilterBar'
import ClinicList from '@/components/city/ClinicList'
import FAQSection from '@/components/city/FAQSection'
import type { ClinicSummary } from '@/types/clinic'

export const revalidate = 86400

interface Params {
  state: string
  city: string
}

interface SearchParams {
  modality?: string
  telehealth?: string
  insurance?: string
}

export async function generateStaticParams(): Promise<Params[]> {
  const supabase = createStaticClient()
  const { data } = await supabase
    .from('clinics')
    .select('state, city')
    .order('state')

  if (!data) return []

  const seen = new Set<string>()
  const params: Params[] = []
  for (const row of data) {
    const key = `${toUrlSegment(row.state)}-${toUrlSegment(row.city)}`
    if (!seen.has(key)) {
      seen.add(key)
      params.push({
        state: toUrlSegment(row.state),
        city: toUrlSegment(row.city),
      })
    }
  }
  return params
}

async function getCityData(stateParam: string, cityParam: string, filters: SearchParams) {
  const supabase = createClient()

  // Resolve state + city from URL params
  const { data: allRows } = await supabase
    .from('clinics')
    .select('state, state_code, city')

  if (!allRows) return null

  const stateRow = allRows.find((r) => toUrlSegment(r.state) === stateParam)
  if (!stateRow) return null

  const cityRow = allRows.find(
    (r) =>
      toUrlSegment(r.state) === stateParam && toUrlSegment(r.city) === cityParam
  )
  if (!cityRow) return null

  // Build query with filters
  let query = supabase
    .from('clinics')
    .select(
      `id, slug, name, city, state, state_code, photo, rating, reviews,
       primary_modality, modalities_offered, verification_status,
       accepts_insurance, offers_telehealth, phone, address, booking_appointment_link`
    )
    .eq('state_code', stateRow.state_code)
    .eq('city', cityRow.city)
    .order('rating', { ascending: false, nullsFirst: false })

  if (filters.modality) {
    query = query.contains('modalities_offered', [filters.modality])
  }
  if (filters.telehealth === 'true') {
    query = query.eq('offers_telehealth', true)
  }
  if (filters.insurance === 'yes') {
    query = query.in('accepts_insurance', ['Yes', 'Partial'])
  }

  const { data: clinics } = await query

  // Get unique modalities for this city (for FilterBar options)
  const { data: modalityRows } = await supabase
    .from('clinics')
    .select('modalities_offered')
    .eq('state_code', stateRow.state_code)
    .eq('city', cityRow.city)

  const modalitySet = new Set<string>()
  for (const row of modalityRows ?? []) {
    for (const m of row.modalities_offered ?? []) {
      modalitySet.add(m)
    }
  }

  return {
    state: stateRow.state,
    stateCode: stateRow.state_code,
    city: cityRow.city,
    clinics: (clinics ?? []) as ClinicSummary[],
    modalities: Array.from(modalitySet).sort(),
  }
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const data = await getCityData(params.state, params.city, {})
  if (!data) return {}

  return {
    title: `${data.clinics.length} Ketamine Clinics in ${data.city}, ${data.stateCode}`,
    description: `Find verified ketamine therapy providers in ${data.city}, ${data.state}. Compare ${data.clinics.length} clinics by modality, insurance, and pricing.`,
    openGraph: {
      title: `Ketamine Clinics in ${data.city}, ${data.stateCode} | Psychedelic Beacon`,
      images: [{ url: '/og-default.png', width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/clinics/${params.state}/${params.city}`,
    },
  }
}

export default async function CityPage({
  params,
  searchParams,
}: {
  params: Params
  searchParams: SearchParams
}) {
  const data = await getCityData(params.state, params.city, searchParams)
  if (!data) notFound()

  const faqs = [
    {
      q: `How many ketamine clinics are in ${data.city}, ${data.stateCode}?`,
      a: `There are ${data.clinics.length} ketamine therapy providers listed in ${data.city}, ${data.state} on Psychedelic Beacon. This includes IV ketamine infusion centers, Spravato providers, and ketamine-assisted psychotherapy practices.`,
    },
    {
      q: `Does insurance cover ketamine therapy in ${data.city}?`,
      a: `Insurance coverage for ketamine therapy varies by provider and plan. Some clinics in ${data.city} accept insurance for Spravato (esketamine), while IV ketamine is often considered off-label. Use our insurance filter to find providers that work with your coverage.`,
    },
    {
      q: `What does ketamine infusion therapy cost in ${data.city}?`,
      a: `Costs for ketamine therapy in ${data.city} vary by provider and treatment type. IV ketamine infusions typically range from $300–$800 per session, while package deals may offer better value. Always contact providers directly for current pricing.`,
    },
    {
      q: `Is ketamine therapy safe and legal in ${data.city}?`,
      a: `Yes — ketamine is an FDA-approved medication that has been used in medicine for decades. When administered by licensed medical professionals, ketamine therapy is considered safe. All providers listed on Psychedelic Beacon operate legally within their state and federal regulations.`,
    },
  ]

  const faqSchema = buildFAQSchema(faqs)
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: `${process.env.NEXT_PUBLIC_SITE_URL}/` },
    { name: data.state, url: `${process.env.NEXT_PUBLIC_SITE_URL}/clinics/${params.state}` },
    { name: data.city, url: `${process.env.NEXT_PUBLIC_SITE_URL}/clinics/${params.state}/${params.city}` },
  ])

  return (
    <>
      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="schema-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <CityHero
        city={data.city}
        state={data.state}
        stateCode={data.stateCode}
        stateParam={params.state}
        count={data.clinics.length}
      />

      <Suspense fallback={<div className="h-14 bg-white border-b border-neutral-200" />}>
        <FilterBar
          modalities={data.modalities}
          activeModality={searchParams.modality}
          activeTelehealth={searchParams.telehealth === 'true'}
          activeInsurance={searchParams.insurance}
        />
      </Suspense>

      <ClinicList clinics={data.clinics} city={data.city} />

      <FAQSection faqs={faqs} />
    </>
  )
}
