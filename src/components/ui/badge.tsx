'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

function Slot({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) {
  if (!React.isValidElement(children)) return <>{children}</>
  return React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
    ...props,
    ...(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>).props,
    className: [
      (props as { className?: string }).className,
      ((children as React.ReactElement<{ className?: string }>).props as { className?: string }).className,
    ]
      .filter(Boolean)
      .join(' '),
  })
}

const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-[hsl(var(--ring))] focus-visible:ring-[3px] focus-visible:ring-[hsl(var(--ring)/0.5)] [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default:     'bg-[var(--badge-brand-background)] border-[var(--badge-brand-border)] text-[var(--badge-brand-text)]',
        secondary:   'bg-[var(--badge-gray-background)] border-[var(--badge-gray-border)] text-[var(--badge-gray-text)]',
        outline:     'bg-[var(--badge-outline-background)] border-[var(--badge-outline-border)] text-[var(--badge-outline-text)]',
        destructive: 'bg-[var(--badge-error-background)] border-[var(--badge-error-border)] text-[var(--badge-error-text)]',
        success:     'bg-[var(--badge-success-background)] border-[var(--badge-success-border)] text-[var(--badge-success-text)]',
        warning:     'bg-[var(--badge-warning-background)] border-[var(--badge-warning-border)] text-[var(--badge-warning-text)]',
        info:        'bg-[var(--badge-info-background)] border-[var(--badge-info-border)] text-[var(--badge-info-text)]',
      },
      size: {
        sm: 'px-2 py-0.5',
        md: 'px-2.5 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
)

export interface BadgeProps
  extends React.ComponentProps<'span'>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
  asChild?: boolean
}

export function Badge({
  className,
  variant,
  size,
  dot = false,
  asChild = false,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : 'span'
  return (
    <Comp
      data-slot="badge"
      data-variant={variant ?? 'default'}
      {...(dot ? { 'data-dot': 'true' } : {})}
      className={badgeVariants({ variant, size, className })}
      {...props}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </Comp>
  )
}

export { badgeVariants }
