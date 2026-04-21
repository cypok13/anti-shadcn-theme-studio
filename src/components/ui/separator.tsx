'use client'

import { cn } from '@/lib/utils'

export interface SeparatorProps extends React.HTMLAttributes<HTMLElement> {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
}

export function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: SeparatorProps) {
  const role = decorative ? 'none' : 'separator'
  const ariaOrientation = !decorative && orientation === 'vertical' ? 'vertical' : undefined

  if (orientation === 'vertical') {
    return (
      <div
        data-slot="separator"
        data-orientation="vertical"
        role={role}
        aria-orientation={ariaOrientation}
        className={cn('shrink-0 bg-[hsl(var(--border))] h-full w-px', className)}
        {...props}
      />
    )
  }

  return (
    <hr
      data-slot="separator"
      data-orientation="horizontal"
      role={role}
      className={cn('shrink-0 border-none bg-[hsl(var(--border))] h-px w-full my-0', className)}
      {...props}
    />
  )
}
