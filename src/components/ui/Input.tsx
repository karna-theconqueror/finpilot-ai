import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || props.name
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-10 w-full rounded-xl border border-white/10 bg-bg-secondary px-3 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-brand-blue/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/30',
            error && 'border-red-400/60 focus:border-red-400 focus:ring-red-400/20',
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'
