'use client'

import { DayPicker } from 'react-day-picker'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

export function Calendar({ className, ...props }: CalendarProps) {
  return (
    <DayPicker
      className={className}
      classNames={{
        months: 'flex flex-col sm:flex-row gap-4',
        month: 'flex flex-col gap-4',
        month_caption: 'flex justify-center pt-1 relative items-center w-full',
        caption_label: 'text-sm font-medium',
        nav: 'flex items-center gap-1',
        button_previous:
          'cursor-pointer absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-[var(--radius)] border border-[hsl(var(--border))] text-[hsl(var(--foreground))]',
        button_next:
          'cursor-pointer absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-[var(--radius)] border border-[hsl(var(--border))] text-[hsl(var(--foreground))]',
        month_grid: 'w-full border-collapse space-x-1',
        weekdays: 'flex',
        weekday: 'text-[hsl(var(--muted-foreground))] rounded-md w-9 font-normal text-[0.8rem]',
        week: 'flex w-full mt-2',
        day: 'h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20',
        day_button:
          'cursor-pointer h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] rounded-[var(--radius)] inline-flex items-center justify-center text-sm transition-colors',
        range_end: '[&>button]:bg-[hsl(var(--primary))] [&>button]:text-[hsl(var(--primary-foreground))] [&>button]:hover:bg-[hsl(var(--primary))] [&>button]:hover:text-[hsl(var(--primary-foreground))] [&>button]:rounded-r-[var(--radius)] [&>button]:rounded-l-none bg-[hsl(var(--muted))] rounded-r-[var(--radius)] rounded-l-none',
        range_start: '[&>button]:bg-[hsl(var(--primary))] [&>button]:text-[hsl(var(--primary-foreground))] [&>button]:hover:bg-[hsl(var(--primary))] [&>button]:hover:text-[hsl(var(--primary-foreground))] [&>button]:rounded-l-[var(--radius)] [&>button]:rounded-r-none bg-[hsl(var(--muted))] rounded-l-[var(--radius)] rounded-r-none',
        range_middle: '[&>button]:!bg-[hsl(var(--muted))] [&>button]:!text-[hsl(var(--foreground))] [&>button]:hover:!bg-[hsl(var(--muted))] aria-selected:bg-[hsl(var(--muted))] aria-selected:text-[hsl(var(--foreground))] rounded-none [&>button]:rounded-none',
        selected:
          '[&>button]:bg-[hsl(var(--primary))] [&>button]:text-[hsl(var(--primary-foreground))] [&>button]:hover:bg-[hsl(var(--primary))] [&>button]:hover:text-[hsl(var(--primary-foreground))]',
        today: '[&>button]:bg-[hsl(var(--muted))] [&>button]:text-[hsl(var(--foreground))] [&>button]:font-semibold',
        outside:
          'text-[hsl(var(--muted-foreground))] opacity-50 aria-selected:bg-[hsl(var(--muted))]/50 aria-selected:text-[hsl(var(--muted-foreground))] aria-selected:opacity-30',
        disabled: 'text-[hsl(var(--muted-foreground))] opacity-50',
        hidden: 'invisible',
      }}
      {...props}
    />
  )
}
