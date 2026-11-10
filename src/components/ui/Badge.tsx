import type { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

type Variant = 'default' | 'blue' | 'green' | 'violet' | 'warning' | 'muted'

const styles: Record<Variant, string> = {
  default: 'bg-white/10 text-text-primary',
  blue: 'bg-brand-blue/15 text-brand-blue border border-brand-blue/20',
  green: 'bg-brand-green/15 text-brand-green border border-brand-green/20',
  violet: 'bg-brand-violet/15 text-brand-violet border border-brand-violet/20',
  warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/20',
  muted: 'bg-white/5 text-text-secondary border border-white/10',
}

export function Badge({ className, variant = 'default', ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', styles[variant], className)}
      {...props}
    />
  )
}
