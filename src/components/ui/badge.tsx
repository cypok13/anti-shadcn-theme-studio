'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-[hsl(var(--ring))] focus-visible:ring-[3px] focus-visible:ring-[hsl(var(--ring)/0.5)] [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default:     'border-transparent bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] [a&]:hover:bg-[hsl(var(--primary)/0.9)]',
        secondary:   'border-transparent bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] [a&]:hover:bg-[hsl(var(--secondary)/0.9)]',
        outline:     'border-[hsl(var(--border))] text-[hsl(var(--foreground))] [a&]:hover:bg-[hsl(var(--accent))]',
        destructive: 'border-transparent bg-[hsl(var(--destructive)/0.15)] text-[hsl(var(--destructive))]',
        success:     'border-transparent bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]',
        warning:     'border-transparent bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))]',
        info:        'border-transparent bg-[hsl(var(--info)/0.15)] text-[hsl(var(--info))]',
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
