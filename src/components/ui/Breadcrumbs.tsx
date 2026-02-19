import Link from 'next/link'
import { cn } from '@/lib/cn'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
  light?: boolean
}

export default function Breadcrumbs({ items, className, light }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center flex-wrap gap-1', className)}>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          {index > 0 && (
            <span className={cn('text-sm', light ? 'text-teal-200' : 'text-neutral-400')}>
              /
            </span>
          )}
          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className={cn(
                'text-sm hover:underline transition-colors',
                light ? 'text-teal-100 hover:text-white' : 'text-neutral-500 hover:text-teal'
              )}
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={cn(
                'text-sm font-medium',
                light ? 'text-white' : 'text-neutral-800'
              )}
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
