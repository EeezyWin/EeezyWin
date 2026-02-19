import Breadcrumbs from '@/components/ui/Breadcrumbs'

interface StateHeroProps {
  stateName: string
  cityCount: number
  clinicCount: number
}

export default function StateHero({ stateName, cityCount, clinicCount }: StateHeroProps) {
  return (
    <section className="gradient-hero py-14">
      <div className="container-narrow">
        <Breadcrumbs
          light
          items={[
            { label: 'Home', href: '/' },
            { label: 'Clinics', href: '/' },
            { label: stateName },
          ]}
          className="mb-6"
        />
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
          Ketamine Clinics in {stateName}
        </h1>
        <p className="text-teal-100 text-lg">
          {clinicCount} providers across {cityCount} {cityCount === 1 ? 'city' : 'cities'}
        </p>
      </div>
    </section>
  )
}
