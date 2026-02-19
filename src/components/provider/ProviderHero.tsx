'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Clinic } from '@/types/clinic'
import StarRating from '@/components/ui/StarRating'
import VerificationBadge from './VerificationBadge'
import ClaimListingModal from './ClaimListingModal'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { formatPhone, formatWebsite } from '@/lib/utils'
import { toUrlSegment } from '@/lib/slugify'

interface ProviderHeroProps {
  clinic: Clinic
}

export default function ProviderHero({ clinic }: ProviderHeroProps) {
  const [claimOpen, setClaimOpen] = useState(false)
  const phone = formatPhone(clinic.phone)
  const websiteDisplay = formatWebsite(clinic.website)

  return (
    <>
      {/* Photo banner */}
      <div className="relative h-56 sm:h-72 bg-gradient-card overflow-hidden">
        {clinic.photo ? (
          <Image
            src={clinic.photo}
            alt={clinic.name}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 gradient-hero opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Hero content */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container-narrow">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: clinic.state, href: `/clinics/${toUrlSegment(clinic.state)}` },
              { label: clinic.city, href: `/clinics/${toUrlSegment(clinic.state)}/${toUrlSegment(clinic.city)}` },
              { label: clinic.name },
            ]}
            className="pt-5 pb-4"
          />

          <div className="pb-8">
            {/* Verification + category */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <VerificationBadge status={clinic.verification_status} />
              {clinic.category && (
                <span className="text-sm text-neutral-500">{clinic.category}</span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
              {clinic.name}
            </h1>

            {/* Location */}
            <p className="text-neutral-500 mb-4 flex items-center gap-1.5">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {clinic.address ?? `${clinic.city}, ${clinic.state}`}
            </p>

            {/* Rating */}
            <StarRating rating={clinic.rating} reviews={clinic.reviews} size="lg" className="mb-6" />

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              {phone && (
                <a
                  href={`tel:${clinic.phone}`}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-teal text-white font-semibold rounded-xl hover:bg-teal-dark transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {phone}
                </a>
              )}
              {clinic.website && (
                <a
                  href={clinic.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 border border-teal text-teal font-semibold rounded-xl hover:bg-teal-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {websiteDisplay ?? 'Visit Website'}
                </a>
              )}
              {clinic.booking_appointment_link && (
                <a
                  href={clinic.booking_appointment_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-gold text-white font-semibold rounded-xl hover:bg-gold-dark transition-colors"
                >
                  Book Appointment
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              )}
              <button
                onClick={() => setClaimOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 border border-neutral-200 text-neutral-600 font-medium rounded-xl hover:bg-neutral-50 transition-colors text-sm"
              >
                Claim This Listing
              </button>
            </div>
          </div>
        </div>
      </div>

      <ClaimListingModal
        isOpen={claimOpen}
        onClose={() => setClaimOpen(false)}
        clinicId={clinic.id}
        clinicName={clinic.name}
      />
    </>
  )
}
