import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  let body: {
    clinicId?: string
    clinicName?: string
    name?: string
    email?: string
    role?: string
    message?: string
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { clinicId, clinicName, name, email, role, message } = body

  // Basic validation
  if (!name || !email || !clinicId || !clinicName) {
    return NextResponse.json(
      { error: 'Missing required fields: name, email, clinicId, clinicName' },
      { status: 400 }
    )
  }

  // Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  // Use service role key to bypass RLS for insert
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Store in Supabase
  const { error: dbError } = await supabase.from('claim_submissions').insert({
    clinic_id: clinicId,
    clinic_name: clinicName,
    name,
    email,
    role: role ?? null,
    message: message ?? null,
  })

  if (dbError) {
    console.error('Claim DB insert error:', dbError)
    // Continue even if DB insert fails — still send email
  }

  // Send email via Resend if API key is configured
  const resendKey = process.env.RESEND_API_KEY
  const ownerEmail = process.env.OWNER_EMAIL

  if (resendKey && ownerEmail) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(resendKey)
      await resend.emails.send({
        from: 'Psychedelic Beacon <onboarding@resend.dev>',
        to: ownerEmail,
        replyTo: email,
        subject: `Claim Request: ${clinicName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0D6E6E;">New Listing Claim Request</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 140px;">Clinic:</td>
                <td style="padding: 8px 0; font-weight: bold;">${clinicName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Clinic ID:</td>
                <td style="padding: 8px 0;">${clinicId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Submitted by:</td>
                <td style="padding: 8px 0;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Role:</td>
                <td style="padding: 8px 0;">${role ?? 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; vertical-align: top;">Message:</td>
                <td style="padding: 8px 0;">${message ?? 'No message provided'}</td>
              </tr>
            </table>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
            <p style="color: #999; font-size: 12px;">Sent via Psychedelic Beacon claim form</p>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('Resend email error:', emailErr)
      // Don't fail the request if email fails
    }
  }

  return NextResponse.json({ success: true })
}
