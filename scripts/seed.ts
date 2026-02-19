import { createClient } from '@supabase/supabase-js'
import { parse } from 'csv-parse/sync'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Shared slug generator
function slugPart(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .trim()
}

function generateSlug(name: string, city: string): string {
  return `${slugPart(name)}-${slugPart(city)}`
}

// ---- PARSE HELPERS ----

function parseBoolean(val: string): boolean | null {
  if (val === 'True') return true
  if (val === 'False') return false
  return null
}

function parseNumber(val: string): number | null {
  if (!val || val === 'not_published' || val === '') return null
  const n = Number(val)
  return isNaN(n) ? null : n
}

function parseInteger(val: string): number | null {
  const n = parseNumber(val)
  return n !== null ? Math.round(n) : null
}

function parseArray(val: string, delimiter: string): string[] {
  if (!val || val === 'not_published' || val.trim() === '') return []
  return val
    .split(delimiter)
    .map((s) => s.trim())
    .filter(Boolean)
}

function parseJSON(val: string): object | null {
  if (!val || val === 'not_published' || val.trim() === '') return null
  try {
    return JSON.parse(val)
  } catch {
    return null
  }
}

function parseNullable(val: string): string | null {
  if (!val || val === 'not_published' || val.trim() === '') return null
  return val.trim()
}

function parseAcceptsInsurance(val: string): string | null {
  if (['Yes', 'Partial', 'No'].includes(val)) return val
  return null
}

function parseVerificationStatus(val: string): string {
  if (['VERIFIED', 'LIKELY', 'UNVERIFIED'].includes(val)) return val
  return 'UNVERIFIED'
}

// ---- MAIN ----

async function seed() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  const csvPath = resolve(__dirname, '../data/clinics.csv')
  console.log(`Reading CSV from: ${csvPath}`)
  const raw = readFileSync(csvPath, 'utf-8')
  const records: Record<string, string>[] = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    trim: true,
  })

  console.log(`Parsed ${records.length} rows`)

  // Track slugs for collision resolution
  const slugCounts: Record<string, number> = {}

  const clinics = records.map((row) => {
    const baseSlug = generateSlug(row.name ?? '', row.city ?? '')
    const count = (slugCounts[baseSlug] = (slugCounts[baseSlug] ?? 0) + 1)
    const slug = count > 1 ? `${baseSlug}-${count}` : baseSlug

    return {
      slug,
      name: row.name?.trim() || 'Unknown Clinic',
      category: parseNullable(row.category),
      subtypes: parseArray(row.subtypes, ','),

      address: parseNullable(row.address),
      city: row.city?.trim() || '',
      state: row.state?.trim() || '',
      state_code: row.state_code?.trim() || '',
      postal_code: parseNullable(row.postal_code),
      latitude: parseNumber(row.latitude),
      longitude: parseNumber(row.longitude),

      phone: parseNullable(row.phone),
      website: parseNullable(row.website),
      booking_appointment_link: parseNullable(row.booking_appointment_link),

      rating: parseNumber(row.rating),
      reviews: parseInteger(row.reviews),

      photo: parseNullable(row.photo),

      verified: parseBoolean(row.verified) ?? false,
      verification_status: parseVerificationStatus(row.verification_status),
      confidence_score: parseInteger(row.confidence_score) ?? 0,
      needs_verification: parseBoolean(row.needs_verification) ?? false,

      working_hours: parseJSON(row.working_hours),

      services_found: parseArray(row.services_found, ';'),
      modalities_offered: parseArray(row.modalities_offered, '|'),
      primary_modality: parseNullable(row.primary_modality),

      likely_telehealth: parseBoolean(row.likely_telehealth) ?? false,
      offers_telehealth: parseBoolean(row.offers_telehealth),

      price_per_session: parseNullable(row.price_per_session),
      package_price: parseNullable(row.package_price),
      package_sessions: parseNullable(row.package_sessions),
      pricing_notes: parseNullable(row.pricing_notes),

      accepts_insurance: parseAcceptsInsurance(row.accepts_insurance),
      insurance_plans: parseArray(row.insurance_plans, ','),
      offers_financing: parseBoolean(row.offers_financing),

      lead_provider_name: parseNullable(row.lead_provider_name),
      lead_provider_credentials: parseNullable(row.lead_provider_credentials),
      provider_count: parseInteger(row.provider_count),
      has_integration_therapist: parseBoolean(row.has_integration_therapist),
    }
  })

  // Insert in chunks
  const CHUNK_SIZE = 50
  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < clinics.length; i += CHUNK_SIZE) {
    const chunk = clinics.slice(i, i + CHUNK_SIZE)
    const { error } = await supabase
      .from('clinics')
      .upsert(chunk, { onConflict: 'slug' })

    if (error) {
      console.error(`❌ Chunk ${i}–${i + CHUNK_SIZE}:`, error.message)
      errorCount += chunk.length
    } else {
      successCount += chunk.length
      process.stdout.write(`\r✓ Inserted ${successCount}/${clinics.length} rows`)
    }
  }

  console.log(`\n\n✅ Seed complete: ${successCount} inserted, ${errorCount} errors`)

  // Print a sample slug for verification
  if (clinics.length > 0) {
    console.log(`\nSample slugs:`)
    clinics.slice(0, 3).forEach((c) => {
      console.log(`  /provider/${c.slug}`)
    })
  }
}

seed().catch(console.error)
