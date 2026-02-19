import Link from 'next/link'
import SearchBar from './SearchBar'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm">
      <div className="container-narrow flex items-center justify-between h-16 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-bold text-neutral-900 text-lg hidden sm:block">
            Psychedelic<span className="text-teal">Beacon</span>
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <SearchBar compact />
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          <Link
            href="/clinics"
            className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-teal rounded-lg hover:bg-teal-50 transition-colors hidden sm:block"
          >
            Browse
          </Link>
          <Link
            href="/#how-it-works"
            className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-teal rounded-lg hover:bg-teal-50 transition-colors hidden sm:block"
          >
            How It Works
          </Link>
          <Link
            href="/clinics"
            className="ml-2 px-4 py-2 text-sm font-semibold text-white bg-teal rounded-xl hover:bg-teal-dark transition-colors"
          >
            Find a Clinic
          </Link>
        </nav>
      </div>
    </header>
  )
}
