import type { Clinic } from '@/types/clinic'
import { formatPhone, formatWebsite } from '@/lib/utils'

interface ProviderDetailsProps {
  clinic: Clinic
}

function DetailRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-neutral-100 last:border-0">
      <div className="w-5 h-5 text-teal shrink-0 mt-0.5">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">{label}</p>
        <div className="text-sm text-neutral-800">{children}</div>
      </div>
    </div>
  )
}

export default function ProviderDetails({ clinic }: ProviderDetailsProps) {
  const phone = formatPhone(clinic.phone)
  const websiteDisplay = formatWebsite(clinic.website)

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Contact & Location
      </h3>

      {clinic.address && (
        <DetailRow
          label="Address"
          icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        >
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(clinic.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal transition-colors"
          >
            {clinic.address}
          </a>
        </DetailRow>
      )}

      {phone && (
        <DetailRow
          label="Phone"
          icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
        >
          <a href={`tel:${clinic.phone}`} className="hover:text-teal transition-colors">{phone}</a>
        </DetailRow>
      )}

      {clinic.website && (
        <DetailRow
          label="Website"
          icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>}
        >
          <a href={clinic.website} target="_blank" rel="noopener noreferrer" className="hover:text-teal transition-colors text-teal">
            {websiteDisplay}
          </a>
        </DetailRow>
      )}

      {clinic.lead_provider_name && (
        <DetailRow
          label="Lead Provider"
          icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
        >
          {clinic.lead_provider_name}
          {clinic.lead_provider_credentials && (
            <span className="text-neutral-500 ml-1">({clinic.lead_provider_credentials})</span>
          )}
        </DetailRow>
      )}

      {clinic.provider_count && clinic.provider_count > 0 && (
        <DetailRow
          label="Staff Size"
          icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
        >
          {clinic.provider_count} {clinic.provider_count === 1 ? 'provider' : 'providers'}
        </DetailRow>
      )}

      {clinic.has_integration_therapist && (
        <DetailRow
          label="Integration Therapy"
          icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
        >
          Integration therapist on staff
        </DetailRow>
      )}

      {(clinic.offers_telehealth || clinic.likely_telehealth) && (
        <DetailRow
          label="Telehealth"
          icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
        >
          {clinic.offers_telehealth ? 'Telehealth services available' : 'Telehealth likely available'}
        </DetailRow>
      )}
    </div>
  )
}
