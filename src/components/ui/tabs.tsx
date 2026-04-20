'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const tabsListVariants = cva(
  'group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-[hsl(var(--muted-foreground))]',
  {
    variants: {
      variant: {
        default: 'bg-[hsl(var(--muted))]',
        line: 'gap-1 bg-transparent border-b border-[hsl(var(--border))] w-full rounded-none p-0',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export function Tabs({ ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" {...props} />
}

export function TabsList({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & { variant?: 'default' | 'line' }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5',
        'rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap',
        'cursor-pointer transition-all',
        'text-[hsl(var(--foreground)/0.6)]',
        'hover:text-[hsl(var(--foreground))]',
        'data-[state=active]:bg-[hsl(var(--background))]',
        'data-[state=active]:text-[hsl(var(--foreground))]',
        'data-[state=active]:shadow-sm',
        'focus-visible:border-[hsl(var(--ring))] focus-visible:ring-[3px] focus-visible:ring-[hsl(var(--ring)/0.5)] focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
        // line variant overrides
        'group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:border-0 group-data-[variant=line]/tabs-list:border-b-2 group-data-[variant=line]/tabs-list:border-transparent group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:shadow-none group-data-[variant=line]/tabs-list:h-9 group-data-[variant=line]/tabs-list:pb-2',
        'group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:border-[hsl(var(--primary))] group-data-[variant=line]/tabs-list:data-[state=active]:text-[hsl(var(--foreground))] group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none',
        className
      )}
      {...props}
    />
  )
}

export function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  )
}
