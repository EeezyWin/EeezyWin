export type VerificationStatus = 'VERIFIED' | 'LIKELY' | 'UNVERIFIED'
export type AcceptsInsurance = 'Yes' | 'No' | 'Partial'

export interface WorkingHours {
  Sunday?: string[]
  Monday?: string[]
  Tuesday?: string[]
  Wednesday?: string[]
  Thursday?: string[]
  Friday?: string[]
  Saturday?: string[]
}

export interface Clinic {
  id: string
  slug: string
  name: string
  category: string | null
  subtypes: string[]
  address: string | null
  city: string
  state: string
  state_code: string
  postal_code: string | null
  latitude: number | null
  longitude: number | null
  phone: string | null
  website: string | null
  booking_appointment_link: string | null
  rating: number | null
  reviews: number | null
  photo: string | null
  verified: boolean
  verification_status: VerificationStatus
  confidence_score: number
  needs_verification: boolean
  working_hours: WorkingHours | null
  services_found: string[]
  modalities_offered: string[]
  primary_modality: string | null
  likely_telehealth: boolean
  offers_telehealth: boolean | null
  price_per_session: string | null
  package_price: string | null
  package_sessions: string | null
  pricing_notes: string | null
  accepts_insurance: AcceptsInsurance | null
  insurance_plans: string[]
  offers_financing: boolean | null
  lead_provider_name: string | null
  lead_provider_credentials: string | null
  provider_count: number | null
  has_integration_therapist: boolean | null
  created_at: string
  updated_at: string
}

export type ClinicSummary = Pick<
  Clinic,
  | 'id'
  | 'slug'
  | 'name'
  | 'city'
  | 'state'
  | 'state_code'
  | 'photo'
  | 'rating'
  | 'reviews'
  | 'primary_modality'
  | 'modalities_offered'
  | 'verification_status'
  | 'accepts_insurance'
  | 'offers_telehealth'
  | 'phone'
  | 'address'
  | 'booking_appointment_link'
>

export interface CityCount {
  city: string
  state_code: string
  state: string
  count: number
}
