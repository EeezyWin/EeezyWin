'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { ClinicSummary } from '@/types/clinic'
import { toUrlSegment } from '@/lib/slugify'
import { cn } from '@/lib/cn'

interface SearchResult {
  slug: string
  name: string
  city: string
  state_code: string
  primary_modality: string | null
  verification_status: string
}

interface SearchBarProps {
  compact?: boolean
  large?: boolean
  placeholder?: string
  className?: string
}

export default function SearchBar({
  compact,
  large,
  placeholder = 'Search by city, clinic, or treatment…',
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setQuery(val)
    clearTimeout(debounceRef.current)

    if (val.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(val)}`)
        const data = await res.json()
        setResults(data.results ?? [])
        setIsOpen(true)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      setIsOpen(false)
      router.push(`/api/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  function handleSelect(result: SearchResult) {
    setIsOpen(false)
    setQuery('')
    router.push(`/provider/${result.slug}`)
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <form onSubmit={handleSubmit}>
        <div
          className={cn(
            'flex items-center bg-white border rounded-xl overflow-hidden transition-shadow',
            compact
              ? 'border-neutral-200 shadow-sm focus-within:shadow-md focus-within:border-teal-300'
              : large
              ? 'border-white/30 bg-white/10 backdrop-blur-sm shadow-lg'
              : 'border-neutral-200 shadow-sm'
          )}
        >
          <div className="pl-4 pr-2 text-neutral-400 shrink-0">
            <svg className={cn(compact ? 'w-4 h-4' : 'w-5 h-5')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder={placeholder}
            className={cn(
              'flex-1 bg-transparent outline-none placeholder-neutral-400',
              compact
                ? 'py-2 text-sm text-neutral-800 placeholder-neutral-400'
                : large
                ? 'py-4 text-base text-white placeholder-white/60'
                : 'py-3 text-sm text-neutral-800'
            )}
          />
          {loading && (
            <div className="px-3">
              <div className="w-4 h-4 border-2 border-teal border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!compact && (
            <button
              type="submit"
              className={cn(
                'shrink-0 font-semibold transition-colors',
                large
                  ? 'mx-2 px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold-dark text-base'
                  : 'mx-2 px-5 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark text-sm'
              )}
            >
              Search
            </button>
          )}
        </div>
      </form>

      {/* Dropdown results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl border border-neutral-200 shadow-card-hover z-50 overflow-hidden">
          <ul>
            {results.map((r, i) => (
              <li key={r.slug}>
                <button
                  onClick={() => handleSelect(r)}
                  className={cn(
                    'w-full text-left px-4 py-3 hover:bg-neutral-50 transition-colors flex items-start gap-3',
                    i > 0 && 'border-t border-neutral-100'
                  )}
                >
                  <div className="pt-0.5">
                    <svg className="w-4 h-4 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 truncate">{r.name}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {r.city}, {r.state_code}
                      {r.primary_modality ? ` · ${r.primary_modality}` : ''}
                    </p>
                  </div>
                  {r.verification_status === 'VERIFIED' && (
                    <span className="ml-auto shrink-0 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
