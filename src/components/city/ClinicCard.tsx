import Link from 'next/link'
import Image from 'next/image'
import type { ClinicSummary } from '@/types/clinic'
import Badge from '@/components/ui/Badge'
import StarRating from '@/components/ui/StarRating'
import { formatPhone } from '@/lib/utils'

interface ClinicCardProps {
  clinic: ClinicSummary
}

function VerificationBadge({ status }: { status: string }) {
  if (status === 'VERIFIED') {
    return (
      <Badge variant="green">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Verified
      </Badge>
    )
  }
  if (status === 'LIKELY') {
    return <Badge variant="yellow">Likely Verified</Badge>
  }
  return null
}

export default function ClinicCard({ clinic }: ClinicCardProps) {
  const phone = formatPhone(clinic.phone)

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-card hover:shadow-card-hover hover:border-teal-200 transition-all duration-200 flex flex-col">
      {/* Photo */}
      <div className="relative h-44 bg-gradient-card overflow-hidden">
        {clinic.photo ? (
          <Image
            src={clinic.photo}
            alt={clinic.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-teal-50">
            <svg className="w-16 h-16 text-teal-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}
        {/* Verification badge overlay */}
        <div className="absolute top-3 left-3">
          <VerificationBadge status={clinic.verification_status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/provider/${clinic.slug}`} className="group">
            <h3 className="font-bold text-neutral-900 group-hover:text-teal transition-colors leading-snug">
              {clinic.name}
            </h3>
          </Link>
        </div>

        {/* Rating */}
        <StarRating rating={clinic.rating} reviews={clinic.reviews} size="sm" className="mb-3" />

        {/* Address */}
        {clinic.address && (
          <p className="text-xs text-neutral-500 mb-3 flex items-start gap-1.5">
            <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{clinic.address}</span>
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {clinic.primary_modality && (
            <Badge variant="teal" size="sm">{clinic.primary_modality}</Badge>
          )}
          {clinic.offers_telehealth && (
            <Badge variant="outline" size="sm">Telehealth</Badge>
          )}
          {(clinic.accepts_insurance === 'Yes' || clinic.accepts_insurance === 'Partial') && (
            <Badge variant="gold" size="sm">Insurance</Badge>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          <Link
            href={`/provider/${clinic.slug}`}
            className="flex-1 px-4 py-2.5 bg-teal text-white text-sm font-semibold rounded-xl text-center hover:bg-teal-dark transition-colors"
          >
            View Profile
          </Link>
          {clinic.booking_appointment_link && (
            <a
              href={clinic.booking_appointment_link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 border border-teal text-teal text-sm font-semibold rounded-xl hover:bg-teal-50 transition-colors"
            >
              Book
            </a>
          )}
        </div>

        {/* Phone */}
        {phone && (
          <a
            href={`tel:${clinic.phone}`}
            className="mt-3 text-xs text-neutral-500 hover:text-teal flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {phone}
          </a>
        )}
      </div>
    </div>
  )
}
