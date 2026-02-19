import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-6">
        <div className="text-8xl font-bold text-teal-100 mb-4">404</div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-4">Page Not Found</h1>
        <p className="text-neutral-500 mb-8 max-w-md mx-auto">
          We couldn&apos;t find what you were looking for. The clinic may have moved, or this URL may be outdated.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-teal text-white font-semibold rounded-xl hover:bg-teal-dark transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/clinics/new-york"
            className="px-6 py-3 border border-neutral-200 text-neutral-700 font-semibold rounded-xl hover:bg-neutral-50 transition-colors"
          >
            Browse Clinics
          </Link>
        </div>
      </div>
    </div>
  )
}
