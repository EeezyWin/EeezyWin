import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Script from 'next/script'
import { createClient } from '@/lib/supabase/server'
import { createStaticClient } from '@/lib/supabase/static'
import { buildLocalBusinessSchema, buildBreadcrumbSchema } from '@/lib/schema-markup'
import { toUrlSegment } from '@/lib/slugify'
import ProviderHero from '@/components/provider/ProviderHero'
import ProviderDetails from '@/components/provider/ProviderDetails'
import HoursTable from '@/components/provider/HoursTable'
import ModalitiesList from '@/components/provider/ModalitiesList'
import InsuranceSection from '@/components/provider/InsuranceSection'
import PricingSection from '@/components/provider/PricingSection'
import type { Clinic } from '@/types/clinic'

export const revalidate = 86400

interface Params {
  slug: string
}

export async function generateStaticParams(): Promise<Params[]> {
  const supabase = createStaticClient()
  const { data } = await supabase.from('clinics').select('slug')
  return (data ?? []).map((row) => ({ slug: row.slug }))
}

async function getClinic(slug: string): Promise<Clinic | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('clinics')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data as Clinic
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const clinic = await getClinic(params.slug)
  if (!clinic) return {}

  const description = [
    `${clinic.name} offers ${clinic.primary_modality ?? 'ketamine therapy'} in ${clinic.city}, ${clinic.state}.`,
    clinic.rating ? `Rated ${clinic.rating}/5` : '',
    clinic.accepts_insurance === 'Yes'
      ? 'Accepts insurance.'
      : clinic.accepts_insurance === 'Partial'
      ? 'Partial insurance coverage.'
      : '',
    'View hours, pricing, and provider information.',
  ]
    .filter(Boolean)
    .join(' ')

  return {
    title: `${clinic.name} — ${clinic.city}, ${clinic.state_code}`,
    description,
    openGraph: {
      title: clinic.name,
      description,
      images: clinic.photo
        ? [{ url: clinic.photo }]
        : [{ url: '/og-default.png', width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/provider/${clinic.slug}`,
    },
  }
}

export default async function ProviderPage({ params }: { params: Params }) {
  const clinic = await getClinic(params.slug)
  if (!clinic) notFound()

  const schema = buildLocalBusinessSchema(clinic)
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: `${process.env.NEXT_PUBLIC_SITE_URL}/` },
    {
      name: clinic.state,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/clinics/${toUrlSegment(clinic.state)}`,
    },
    {
      name: clinic.city,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/clinics/${toUrlSegment(clinic.state)}/${toUrlSegment(clinic.city)}`,
    },
    { name: clinic.name, url: `${process.env.NEXT_PUBLIC_SITE_URL}/provider/${clinic.slug}` },
  ])

  return (
    <>
      <Script
        id="schema-localbusiness"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Script
        id="schema-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <ProviderHero clinic={clinic} />

      <div className="container-narrow py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <ModalitiesList
              modalities={clinic.modalities_offered}
              primaryModality={clinic.primary_modality}
            />
            <PricingSection
              pricePerSession={clinic.price_per_session}
              packagePrice={clinic.package_price}
              packageSessions={clinic.package_sessions}
              pricingNotes={clinic.pricing_notes}
            />
            <InsuranceSection
              acceptsInsurance={clinic.accepts_insurance}
              insurancePlans={clinic.insurance_plans}
              offersFinancing={clinic.offers_financing}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ProviderDetails clinic={clinic} />
            <HoursTable hours={clinic.working_hours} />

            {/* Claim listing card */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 text-center">
              <p className="text-sm font-semibold text-neutral-700 mb-1">Own this listing?</p>
              <p className="text-xs text-neutral-500 mb-4">
                Update your information, add photos, and respond to reviews.
              </p>
              <a
                href="#claim"
                className="text-sm font-semibold text-teal hover:text-teal-dark transition-colors"
              >
                Claim this listing →
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
