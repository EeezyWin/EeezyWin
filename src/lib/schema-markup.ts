import type { Clinic, WorkingHours } from '@/types/clinic'

const SCHEMA_ORG_DAYS: Record<string, string> = {
  Sunday: 'Sunday',
  Monday: 'Monday',
  Tuesday: 'Tuesday',
  Wednesday: 'Wednesday',
  Thursday: 'Thursday',
  Friday: 'Friday',
  Saturday: 'Saturday',
}

const UNRELIABLE_HOURS_PATTERNS = [
  /open\s*24\s*hours?/i,
  /24\s*hours?/i,
  /24\/7/i,
  /always\s*open/i,
]

function hoursAreReliable(hours: WorkingHours): boolean {
  const allTimes = Object.values(hours).flat().filter((v) => v && v !== 'Closed')
  if (allTimes.length === 0) return false
  return !allTimes.some((t) => UNRELIABLE_HOURS_PATTERNS.some((re) => re.test(t)))
}

function buildHoursSpec(hours: WorkingHours | null) {
  if (!hours) return undefined
  if (!hoursAreReliable(hours)) return undefined
  return Object.entries(hours)
    .filter(([, times]) => times[0] && times[0] !== 'Closed')
    .map(([day, times]) => {
      const [opens, closes] = (times[0] ?? '').split('-')
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${SCHEMA_ORG_DAYS[day]}`,
        opens: opens?.trim() ?? undefined,
        closes: closes?.trim() ?? undefined,
      }
    })
}

export function buildLocalBusinessSchema(clinic: Clinic) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'MedicalBusiness'],
    name: clinic.name,
    url:
      clinic.website ??
      `${process.env.NEXT_PUBLIC_SITE_URL}/provider/${clinic.slug}`,
  }

  if (clinic.photo) schema.image = clinic.photo
  if (clinic.phone) schema.telephone = clinic.phone

  if (clinic.address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: clinic.address,
      addressLocality: clinic.city,
      addressRegion: clinic.state_code,
      postalCode: clinic.postal_code ?? undefined,
      addressCountry: 'US',
    }
  }

  if (clinic.latitude && clinic.longitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: clinic.latitude,
      longitude: clinic.longitude,
    }
    schema.hasMap = `https://maps.google.com/?q=${clinic.latitude},${clinic.longitude}`
  }

  if (clinic.rating && clinic.reviews) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: clinic.rating,
      reviewCount: clinic.reviews,
    }
  }

  if (clinic.primary_modality) {
    schema.medicalSpecialty = clinic.primary_modality
  }

  const hoursSpec = buildHoursSpec(clinic.working_hours)
  if (hoursSpec && hoursSpec.length > 0) {
    schema.openingHoursSpecification = hoursSpec
  }

  return schema
}

export function buildFAQSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  }
}

export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
