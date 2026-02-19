import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

const FIELDS = 'slug, name, city, state_code, primary_modality, verification_status, photo'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? ''

  if (q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Strategy 1: Full-text search (handles multi-word, stemming, ranking)
  const { data: ftsData } = await supabase
    .from('clinics')
    .select(FIELDS)
    .textSearch('search_vector', q, { type: 'websearch', config: 'english' })
    .limit(10)

  if (ftsData && ftsData.length > 0) {
    return NextResponse.json({ results: ftsData })
  }

  // Strategy 2: Case-insensitive partial match across name, city, and state
  // Split query into words and build OR filters so "white plains" matches city="White Plains"
  const words = q.split(/\s+/).filter(Boolean)

  // Build ilike conditions for each word across all searchable text columns
  const conditions = words.flatMap(word => [
    `name.ilike.%${word}%`,
    `city.ilike.%${word}%`,
    `state.ilike.%${word}%`,
    `primary_modality.ilike.%${word}%`,
  ]).join(',')

  const { data: ilikeData } = await supabase
    .from('clinics')
    .select(FIELDS)
    .or(conditions)
    .limit(10)

  return NextResponse.json({ results: ilikeData ?? [] })
}
