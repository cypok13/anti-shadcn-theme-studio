'use client'

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts'

const revenueData = [
  { v: 4000 }, { v: 3000 }, { v: 5000 }, { v: 4780 },
  { v: 5890 }, { v: 4390 }, { v: 6490 }, { v: 5200 },
]

const subscriptionData = [
  { v: 400 }, { v: 300 }, { v: 600 }, { v: 800 },
  { v: 700 }, { v: 900 }, { v: 1000 }, { v: 1200 },
]

export function StatsCard() {
  return (
    <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] [box-shadow:var(--shadow-preset,none)] grid grid-cols-2 divide-x divide-[hsl(var(--border))]">
      <div className="p-4 flex flex-col gap-1">
        <p className="text-xs text-[hsl(var(--muted-foreground))]">Total Revenue</p>
        <p className="text-xl font-bold tabular-nums">$15,231.89</p>
        <p className="text-xs text-[hsl(var(--muted-foreground))]">+20.1% from last month</p>
        <div className="mt-2 h-[60px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" debounce={50} minWidth={0}>
            <LineChart data={revenueData}>
              <Line
                type="monotone"
                dataKey="v"
                stroke="hsl(var(--primary))"
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-1">
        <p className="text-xs text-[hsl(var(--muted-foreground))]">Subscriptions</p>
        <p className="text-xl font-bold tabular-nums">+2,350</p>
        <p className="text-xs text-[hsl(var(--muted-foreground))]">+180.1% from last month</p>
        <div className="mt-2 h-[60px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" debounce={50} minWidth={0}>
            <AreaChart data={subscriptionData}>
              <Area
                type="monotone"
                dataKey="v"
                stroke="hsl(var(--primary))"
                strokeWidth={1.5}
                fill="hsl(var(--primary))"
                fillOpacity={0.05}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
