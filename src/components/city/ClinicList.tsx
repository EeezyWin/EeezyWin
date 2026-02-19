import type { ClinicSummary } from '@/types/clinic'
import ClinicCard from './ClinicCard'

interface ClinicListProps {
  clinics: ClinicSummary[]
  city: string
}

export default function ClinicList({ clinics, city }: ClinicListProps) {
  if (clinics.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-neutral-900 mb-2">No clinics match your filters</h3>
        <p className="text-neutral-500 text-sm">Try removing a filter to see more results.</p>
      </div>
    )
  }

  return (
    <div className="container-narrow py-8">
      <p className="text-sm text-neutral-500 mb-6">
        Showing {clinics.length} {clinics.length === 1 ? 'clinic' : 'clinics'} in {city}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clinics.map(clinic => (
          <ClinicCard key={clinic.id} clinic={clinic} />
        ))}
      </div>
    </div>
  )
}
