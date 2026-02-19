import { cn } from '@/lib/cn'
import Link from 'next/link'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'gold'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
  external?: boolean
  loading?: boolean
  children: React.ReactNode
  className?: string
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-teal text-white hover:bg-teal-dark active:bg-teal-800 shadow-sm',
  secondary:
    'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:bg-neutral-300 border border-neutral-200',
  ghost:
    'bg-transparent text-teal hover:bg-teal-50 active:bg-teal-100',
  outline:
    'bg-transparent text-teal border border-teal hover:bg-teal-50 active:bg-teal-100',
  gold:
    'bg-gold text-white hover:bg-gold-dark active:bg-gold-700 shadow-sm',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  external,
  loading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    variants[variant],
    sizes[size],
    className
  )

  if (href) {
    const linkProps = external
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {}
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    )
  }

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  )
}
