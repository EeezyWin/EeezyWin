import { toUrlSegment } from './slugify'
import type { WorkingHours } from '@/types/clinic'

export function toUrlSegmentReexport(str: string): string {
  return toUrlSegment(str)
}

export function formatPhone(phone: string | null): string | null {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 11 && digits[0] === '1') {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  return phone
}

export function formatWebsite(url: string | null): string | null {
  if (!url) return null
  try {
    const u = new URL(url)
    return u.hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function formatRating(rating: number | null): string {
  if (!rating) return 'No rating'
  return rating.toFixed(1)
}

const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function getTodayHours(hours: WorkingHours | null): string | null {
  if (!hours) return null
  const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const times = hours[dayName as keyof WorkingHours]
  if (!times || times.length === 0) return 'Closed'
  return times[0] === 'Closed' ? 'Closed' : times[0]
}

export function getSortedHours(hours: WorkingHours | null): Array<{ day: string; times: string }> {
  if (!hours) return []
  return DAYS_ORDER.map(day => ({
    day,
    times: hours[day as keyof WorkingHours]?.[0] ?? 'Closed',
  }))
}

export function stateNameFromParam(param: string): string {
  return param
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function cityNameFromParam(param: string): string {
  return param
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length).trimEnd() + '…'
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural ?? singular + 's'}`
}
