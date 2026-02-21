'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STEPS = [
  {
    number: '01',
    title: 'Search Your Area',
    description: 'Enter your city or browse by state to find providers near you. Filter by treatment type, insurance, and more.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Compare Clinics',
    description: 'Review detailed profiles with modalities, pricing, hours, insurance acceptance, and provider credentials.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Book Your Appointment',
    description: 'Call directly, visit their website, or use their online booking link — we connect you straight to the provider.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  function handleFindNearMe() {
    if (!navigator.geolocation) {
      // No geolocation support — fall back to search bar
      document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        router.push(`/search?lat=${latitude.toFixed(5)}&lng=${longitude.toFixed(5)}&radius=25`)
      },
      () => {
        // Permission denied or error — fall back to search bar
        setLoading(false)
        document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' })
      },
      { timeout: 10000 }
    )
  }

  return (
    <section id="how-it-works" className="bg-white py-20">
      <div className="container-narrow">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto">
            Finding the right psychedelic therapy provider is simple with Psychedelic Beacon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px bg-teal-100" />

          {STEPS.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center relative">
              <div className="w-16 h-16 rounded-2xl bg-teal flex items-center justify-center text-white mb-5 shadow-md relative z-10">
                {step.icon}
              </div>
              <div className="text-xs font-bold text-teal mb-2 tracking-widest uppercase">
                Step {step.number}
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">{step.title}</h3>
              <p className="text-neutral-500 leading-relaxed text-sm max-w-xs mx-auto">{step.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
            <button
              onClick={handleFindNearMe}
              disabled={loading}
              className="px-8 py-4 bg-teal text-white font-bold rounded-xl hover:bg-teal-dark transition-colors text-base disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Locating…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Find Clinics Near Me
                </>
              )}
            </button>
            <p className="text-neutral-500 text-sm self-center">
              Free to use · No account required
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
