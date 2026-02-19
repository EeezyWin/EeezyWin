import { cn } from '@/lib/cn'

type BadgeVariant = 'teal' | 'gold' | 'green' | 'yellow' | 'gray' | 'red' | 'outline'
type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  teal: 'bg-teal-50 text-teal-dark border border-teal-100',
  gold: 'bg-gold-50 text-gold-dark border border-gold-100',
  green: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  yellow: 'bg-amber-50 text-amber-700 border border-amber-100',
  gray: 'bg-neutral-100 text-neutral-600 border border-neutral-200',
  red: 'bg-red-50 text-red-700 border border-red-100',
  outline: 'bg-transparent text-neutral-700 border border-neutral-300',
}

const sizes: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
}

export default function Badge({
  children,
  variant = 'gray',
  size = 'sm',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full whitespace-nowrap',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}
