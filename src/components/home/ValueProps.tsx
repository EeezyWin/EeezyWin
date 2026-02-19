const VALUE_PROPS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Verified Providers',
    description: 'Every listing is reviewed and verified for legitimacy. Look for our verification badge for added confidence.',
    color: 'bg-teal-50 text-teal',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Transparent Pricing',
    description: 'See real pricing info, package deals, and financing options upfront. No surprises when you call.',
    color: 'bg-gold-50 text-gold',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    title: 'Insurance & Financing',
    description: 'Filter by providers that accept insurance, offer payment plans, or work with your specific coverage.',
    color: 'bg-emerald-50 text-emerald-600',
  },
]

export default function ValueProps() {
  return (
    <section id="value-props" className="bg-white py-20">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            Why Use Psychedelic Beacon?
          </h2>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
            Finding the right clinic shouldn&apos;t be overwhelming. We&apos;ve done the research so you can focus on your healing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {VALUE_PROPS.map(prop => (
            <div
              key={prop.title}
              className="flex flex-col items-start p-8 rounded-2xl bg-neutral-50 border border-neutral-100 hover:border-teal-100 hover:shadow-card transition-all duration-200"
            >
              <div className={`p-3 rounded-xl mb-5 ${prop.color}`}>
                {prop.icon}
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">{prop.title}</h3>
              <p className="text-neutral-500 leading-relaxed">{prop.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
