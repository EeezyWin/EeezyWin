import type { WorkingHours } from '@/types/clinic'
import { getSortedHours } from '@/lib/utils'
import { cn } from '@/lib/cn'

interface HoursTableProps {
  hours: WorkingHours | null
}

/**
 * Returns true if the hours data looks unreliable and should be hidden.
 * Catches: "Open 24 hours", "24 hours", "24/7", "Always open", etc.
 */
function hasUnreliableHours(hours: WorkingHours): boolean {
  const UNRELIABLE_PATTERNS = [
    /open\s*24\s*hours?/i,
    /24\s*hours?/i,
    /24\/7/i,
    /always\s*open/i,
    /open\s*always/i,
  ]

  const allTimes = Object.values(hours)
    .flat()
    .filter((v) => v && v !== 'Closed')

  // No real hours listed
  if (allTimes.length === 0) return true

  // Any entry matches an unreliable pattern
  return allTimes.some((t) => UNRELIABLE_PATTERNS.some((re) => re.test(t)))
}

export default function HoursTable({ hours }: HoursTableProps) {
  if (!hours) return null
  if (hasUnreliableHours(hours)) return null

  const sorted = getSortedHours(hours)
  if (sorted.length === 0) return null

  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <h3 className="font-bold text-neutral-900 mb-5 flex items-center gap-2">
        <svg className="w-5 h-5 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Hours of Operation
      </h3>
      <div className="space-y-2">
        {sorted.map(({ day, times }) => {
          const isToday = day === todayName
          const isClosed = times === 'Closed'
          return (
            <div
              key={day}
              className={cn(
                'flex items-center justify-between py-1.5 px-3 rounded-lg text-sm',
                isToday ? 'bg-teal-50 font-semibold' : ''
              )}
            >
              <span className={cn(isToday ? 'text-teal' : 'text-neutral-700')}>
                {day}
                {isToday && (
                  <span className="ml-2 text-xs font-normal text-teal-600 bg-teal-100 px-1.5 py-0.5 rounded-full">
                    Today
                  </span>
                )}
              </span>
              <span className={cn(isClosed ? 'text-neutral-400' : isToday ? 'text-teal' : 'text-neutral-900')}>
                {times}
              </span>
            </div>
          )
        })}
      </div>
      <p className="text-xs text-neutral-400 mt-4">
        Hours sourced from public listings. Verify directly with the provider.
      </p>
    </div>
  )
}
