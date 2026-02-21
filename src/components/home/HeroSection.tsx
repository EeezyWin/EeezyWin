import SearchBar from '@/components/layout/SearchBar'

const STATS = [
  { value: '639', label: 'Verified Providers' },
  { value: '49', label: 'States Covered' },
  { value: '310', label: 'Verified Listings' },
]

export default function HeroSection() {
  return (
    <section className="gradient-hero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold rounded-full blur-3xl" />
      </div>

      <div className="container-narrow relative pt-20 pb-24 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 bg-white/15 text-white/90 text-sm font-medium px-4 py-2 rounded-full mb-6">
          <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
          The most trusted psychedelic wellness directory
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance leading-tight">
          Find Ketamine Clinics &<br className="hidden sm:block" />
          <span className="text-gold-light"> Psychedelic Therapy</span>
          <br className="hidden sm:block" /> Near You
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-teal-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          Trusted, verified providers for ketamine infusions, Spravato, and integrative psychedelic therapy — across 49 states.
        </p>

        {/* Search */}
        <div id="search" className="max-w-xl mx-auto mb-12">
          <SearchBar
            large
            placeholder="Search city, clinic name, or treatment type…"
          />
          <p className="text-teal-200 text-sm mt-3">
            Try &ldquo;ketamine NYC&rdquo;, &ldquo;Spravato Denver&rdquo;, or &ldquo;KAP therapy&rdquo;
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8">
          {STATS.map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-white">{stat.value}+</div>
              <div className="text-sm text-teal-200 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
