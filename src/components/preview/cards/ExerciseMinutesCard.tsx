'use client'

import { LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { day: 'Mon', today: 45, average: 30 },
  { day: 'Tue', today: 52, average: 35 },
  { day: 'Wed', today: 38, average: 40 },
  { day: 'Thu', today: 65, average: 38 },
  { day: 'Fri', today: 48, average: 42 },
  { day: 'Sat', today: 72, average: 45 },
  { day: 'Sun', today: 55, average: 38 },
]

export function ExerciseMinutesCard() {
  return (
    <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-6 [box-shadow:var(--shadow-preset,none)]">
      <h3 className="font-semibold text-base mb-1">Exercise Minutes</h3>
      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
        Your exercise minutes are ahead of where you normally are
      </p>
      <ResponsiveContainer width="100%" height={160} debounce={50} minWidth={0}>
        <LineChart data={data}>
          <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 'var(--radius)',
              color: 'hsl(var(--card-foreground))',
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="today"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="average"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            strokeOpacity={0.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
