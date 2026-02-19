'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'

interface FAQ {
  q: string
  a: string
}

interface FAQSectionProps {
  faqs: FAQ[]
}

function FAQItem({ faq }: { faq: FAQ }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-neutral-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-neutral-50 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-neutral-900 text-sm pr-4">{faq.q}</span>
        <span className={cn('shrink-0 text-teal transition-transform duration-200', open && 'rotate-180')}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-sm text-neutral-600 leading-relaxed">{faq.a}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  return (
    <section className="bg-neutral-50 py-16">
      <div className="container-narrow max-w-3xl">
        <h2 className="text-2xl font-bold text-neutral-900 mb-8">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} />
          ))}
        </div>
      </div>
    </section>
  )
}
