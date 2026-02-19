interface PricingSectionProps {
  pricePerSession: string | null
  packagePrice: string | null
  packageSessions: string | null
  pricingNotes: string | null
}

export default function PricingSection({
  pricePerSession,
  packagePrice,
  packageSessions,
  pricingNotes,
}: PricingSectionProps) {
  const hasAnyPricing = pricePerSession || packagePrice || packageSessions || pricingNotes

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <h3 className="font-bold text-neutral-900 mb-5 flex items-center gap-2">
        <svg className="w-5 h-5 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Pricing Information
      </h3>

      {!hasAnyPricing ? (
        <div className="text-center py-4">
          <p className="text-neutral-500 text-sm mb-2">Pricing not publicly listed</p>
          <p className="text-xs text-neutral-400">Contact this provider directly for a quote.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pricePerSession && (
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">Per Session</p>
              <p className="text-sm text-neutral-800 bg-neutral-50 rounded-xl p-3 leading-relaxed">{pricePerSession}</p>
            </div>
          )}
          {(packagePrice || packageSessions) && (
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">Package Options</p>
              <div className="bg-neutral-50 rounded-xl p-3 space-y-1">
                {packageSessions && (
                  <p className="text-sm text-neutral-800">Sessions: {packageSessions}</p>
                )}
                {packagePrice && (
                  <p className="text-sm text-neutral-800">Price: {packagePrice}</p>
                )}
              </div>
            </div>
          )}
          {pricingNotes && (
            <div className="bg-gold-50 border border-gold-100 rounded-xl p-4">
              <p className="text-xs font-semibold text-gold-dark uppercase tracking-wide mb-1">Note</p>
              <p className="text-sm text-neutral-700 leading-relaxed">{pricingNotes}</p>
            </div>
          )}
          <p className="text-xs text-neutral-400 italic">
            Pricing sourced from public information. Verify current rates directly with the provider.
          </p>
        </div>
      )}
    </div>
  )
}
