import Link from 'next/link'

const FEATURED_STATES = [
  { name: 'New York', param: 'new-york' },
  { name: 'California', param: 'california' },
  { name: 'Texas', param: 'texas' },
  { name: 'Florida', param: 'florida' },
  { name: 'Colorado', param: 'colorado' },
  { name: 'Oregon', param: 'oregon' },
]

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 mt-auto">
      <div className="container-narrow py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-bold text-white text-lg">
                Psychedelic<span className="text-teal-light">Beacon</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              The most comprehensive directory of ketamine clinics and psychedelic therapy providers in the US.
            </p>
          </div>

          {/* Browse */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Browse by State</h3>
            <ul className="space-y-2">
              {FEATURED_STATES.map(state => (
                <li key={state.param}>
                  <Link
                    href={`/clinics/${state.param}`}
                    className="text-sm hover:text-teal-light transition-colors"
                  >
                    {state.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Treatments */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Treatments</h3>
            <ul className="space-y-2">
              {['IV Ketamine Infusion', 'Spravato', 'KAP Therapy', 'Psilocybin Therapy', 'MDMA Therapy', 'Ketamine-Assisted Therapy'].map(t => (
                <li key={t}>
                  <span className="text-sm">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">About</h3>
            <ul className="space-y-2">
              <li><Link href="/#how-it-works" className="text-sm hover:text-teal-light transition-colors">How It Works</Link></li>
              <li><Link href="/#value-props" className="text-sm hover:text-teal-light transition-colors">For Providers</Link></li>
              <li><Link href="mailto:hello@psychedelicbeacon.com" className="text-sm hover:text-teal-light transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-center sm:text-left">
            © {new Date().getFullYear()} Psychedelic Beacon. All rights reserved.
          </p>
          <p className="text-xs text-center max-w-lg text-neutral-500">
            <strong className="text-neutral-400">Medical Disclaimer:</strong> This directory is for informational purposes only. Always consult a qualified healthcare provider before beginning any treatment.
          </p>
        </div>
      </div>
    </footer>
  )
}
