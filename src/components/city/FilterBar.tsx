'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { cn } from '@/lib/cn'

interface FilterBarProps {
  modalities: string[]
  activeModality?: string
  activeTelehealth?: boolean
  activeInsurance?: string
}

export default function FilterBar({
  modalities,
  activeModality,
  activeTelehealth,
  activeInsurance,
}: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === null || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  const hasFilters = activeModality || activeTelehealth || activeInsurance

  return (
    <div className="bg-white border-b border-neutral-200 sticky top-16 z-30">
      <div className="container-narrow py-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Modality select */}
          <div className="relative">
            <select
              value={activeModality ?? ''}
              onChange={(e) => updateFilter('modality', e.target.value || null)}
              className={cn(
                'appearance-none pr-8 pl-4 py-2 rounded-xl border text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal transition-colors',
                activeModality
                  ? 'border-teal bg-teal-50 text-teal'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
              )}
            >
              <option value="">All Treatments</option>
              {modalities.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Telehealth toggle */}
          <button
            onClick={() => updateFilter('telehealth', activeTelehealth ? null : 'true')}
            className={cn(
              'px-4 py-2 rounded-xl border text-sm font-medium transition-colors',
              activeTelehealth
                ? 'border-teal bg-teal-50 text-teal'
                : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
            )}
          >
            {activeTelehealth ? '✓ ' : ''}Telehealth
          </button>

          {/* Insurance toggle */}
          <button
            onClick={() => updateFilter('insurance', activeInsurance === 'yes' ? null : 'yes')}
            className={cn(
              'px-4 py-2 rounded-xl border text-sm font-medium transition-colors',
              activeInsurance === 'yes'
                ? 'border-teal bg-teal-50 text-teal'
                : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
            )}
          >
            {activeInsurance === 'yes' ? '✓ ' : ''}Accepts Insurance
          </button>

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={() => router.push(pathname)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
