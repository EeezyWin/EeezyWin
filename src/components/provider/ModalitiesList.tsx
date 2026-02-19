import Badge from '@/components/ui/Badge'

interface ModalitiesListProps {
  modalities: string[]
  primaryModality: string | null
}

export default function ModalitiesList({ modalities, primaryModality }: ModalitiesListProps) {
  if (modalities.length === 0) return null

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <h3 className="font-bold text-neutral-900 mb-5 flex items-center gap-2">
        <svg className="w-5 h-5 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Treatment Modalities
      </h3>
      <div className="flex flex-wrap gap-2">
        {modalities.map(m => (
          <Badge
            key={m}
            variant={m === primaryModality ? 'teal' : 'outline'}
            size="md"
          >
            {m === primaryModality && (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            {m}
          </Badge>
        ))}
      </div>
      {primaryModality && (
        <p className="text-xs text-neutral-500 mt-3">
          Primary modality: <span className="font-medium text-neutral-700">{primaryModality}</span>
        </p>
      )}
    </div>
  )
}
