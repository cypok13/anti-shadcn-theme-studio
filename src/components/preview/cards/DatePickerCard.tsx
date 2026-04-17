'use client'

import { useState, useRef, useEffect } from 'react'
import { Calendar } from '@/components/ui/calendar'
import type { DateRange } from 'react-day-picker'
import { CalendarIcon } from 'lucide-react'

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function DatePickerCard() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2025, 5, 5),
    to: new Date(2025, 5, 13),
  })
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const label =
    date?.from
      ? date.to
        ? `${formatDate(date.from)} - ${formatDate(date.to)}`
        : formatDate(date.from)
      : 'Pick a date'

  return (
    <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-6 [box-shadow:var(--shadow-preset,none)]">
      <h3 className="font-semibold text-base mb-4">Date Picker</h3>
      <div className="relative" ref={containerRef}>
        <button
          onClick={() => setOpen(o => !o)}
          className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
        >
          <CalendarIcon size={16} className="text-[hsl(var(--muted-foreground))]" />
          <span>{label}</span>
        </button>
        {open && (
          <div className="absolute top-full left-0 z-50 mt-1 rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-lg">
            <Calendar
              mode="range"
              selected={date}
              onSelect={setDate}
              defaultMonth={date?.from}
              numberOfMonths={1}
            />
          </div>
        )}
      </div>
    </div>
  )
}
