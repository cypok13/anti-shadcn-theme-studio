'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import type { DateRange } from 'react-day-picker'

export function CalendarCard() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2025, 5, 5),
    to: new Date(2025, 5, 13),
  })

  return (
    <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] [box-shadow:var(--shadow-preset,none)] flex items-center justify-center p-2">
      <Calendar
        mode="range"
        selected={date}
        onSelect={setDate}
        defaultMonth={date?.from}
        numberOfMonths={1}
      />
    </div>
  )
}
