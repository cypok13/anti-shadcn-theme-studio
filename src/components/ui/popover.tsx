'use client'

import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'

export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger
export const PopoverAnchor = PopoverPrimitive.Anchor

export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  showArrow?: boolean
}

export const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(({ className, showArrow = false, sideOffset = 4, align = 'center', children, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      align={align}
      className={[
        'z-50 max-w-[320px] w-max',
        'rounded-[var(--radius)] border border-[hsl(var(--border))]',
        'bg-[hsl(var(--popover))] text-[hsl(var(--popover-foreground))]',
        'p-4 shadow-md',
        'outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
        'data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
        'duration-150',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
      {showArrow && (
        <PopoverPrimitive.Arrow
          className="fill-[hsl(var(--popover))]"
          style={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
          width={8}
          height={4}
        />
      )}
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = 'PopoverContent'
