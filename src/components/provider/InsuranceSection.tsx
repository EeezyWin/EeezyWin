import type { Clinic } from '@/types/clinic'
import Badge from '@/components/ui/Badge'

interface InsuranceSectionProps {
  acceptsInsurance: Clinic['accepts_insurance']
  insurancePlans: string[]
  offersFinancing: boolean | null
}

export default function InsuranceSection({ acceptsInsurance, insurancePlans, offersFinancing }: InsuranceSectionProps) {
  if (!acceptsInsurance && insurancePlans.length === 0 && offersFinancing === null) return null

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <h3 className="font-bold text-neutral-900 mb-5 flex items-center gap-2">
        <svg className="w-5 h-5 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        Insurance & Financing
      </h3>

      {/* Insurance status */}
      <div className="mb-4">
        {acceptsInsurance === 'Yes' && (
          <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold text-sm">Accepts Insurance</span>
          </div>
        )}
        {acceptsInsurance === 'Partial' && (
          <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold text-sm">Partial Insurance Coverage</span>
          </div>
        )}
        {acceptsInsurance === 'No' && (
          <div className="flex items-center gap-2 text-neutral-600 bg-neutral-100 border border-neutral-200 rounded-xl px-4 py-3">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="font-semibold text-sm">Does Not Accept Insurance</span>
          </div>
        )}
      </div>

      {/* Insurance plans */}
      {insurancePlans.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Accepted Plans</p>
          <div className="flex flex-wrap gap-2">
            {insurancePlans.map(plan => (
              <Badge key={plan} variant="gray" size="sm">{plan}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Financing */}
      {offersFinancing && (
        <div className="flex items-center gap-2 text-teal bg-teal-50 border border-teal-100 rounded-xl px-4 py-3">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-semibold text-sm">Financing / Payment Plans Available</span>
        </div>
      )}
    </div>
  )
}
