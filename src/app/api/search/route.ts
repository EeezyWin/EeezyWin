import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Use textSearch for FTS via tsvector GIN index
  const { data, error } = await supabase
    .from('clinics')
    .select('slug, name, city, state_code, primary_modality, verification_status, photo')
    .textSearch('search_vector', q, {
      type: 'websearch',
      config: 'english',
    })
    .limit(10)

  if (error) {
    // Fallback to ilike search if FTS fails (e.g. table not seeded yet)
    const { data: fallback } = await supabase
      .from('clinics')
      .select('slug, name, city, state_code, primary_modality, verification_status, photo')
      .or(`name.ilike.%${q}%,city.ilike.%${q}%`)
      .limit(10)

    return NextResponse.json({ results: fallback ?? [] })
  }

  return NextResponse.json({ results: data ?? [] })
}
