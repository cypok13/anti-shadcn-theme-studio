'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts'

const activityData = Array.from({ length: 13 }, (_, i) => ({
  v: Math.round(200 + Math.sin(i * 0.5) * 100 + i * 10),
  active: i === 6,
}))

const btnBase =
  'rounded-[var(--radius)] font-medium inline-flex items-center justify-center transition-[opacity,background-color,border-color] duration-150 ease-in-out hover:opacity-90 active:opacity-80'

export function ActivityGoalCard() {
  const [goal, setGoal] = useState(350)

  return (
    <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-6 flex flex-col gap-4 [box-shadow:var(--shadow-preset,none)]">
      <div>
        <p className="font-semibold text-base">Move Goal</p>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">Set your daily activity goal</p>
      </div>

      <div className="flex items-center justify-between">
        <button
          className={`${btnBase} h-8 w-8 rounded-full border border-[hsl(var(--border))] bg-transparent text-[hsl(var(--foreground))]`}
          onClick={() => setGoal((g) => Math.max(0, g - 10))}
          aria-label="Decrease goal"
        >
          <Minus className="h-4 w-4" />
        </button>

        <div className="text-center">
          <p className="text-4xl font-bold tabular-nums">{goal}</p>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">Calories/day</p>
        </div>

        <button
          className={`${btnBase} h-8 w-8 rounded-full border border-[hsl(var(--border))] bg-transparent text-[hsl(var(--foreground))]`}
          onClick={() => setGoal((g) => g + 10)}
          aria-label="Increase goal"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="h-[60px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%" debounce={50} minWidth={0}>
          <BarChart data={activityData} barCategoryGap="20%">
            <Bar dataKey="v" radius={4}>
              {activityData.map((entry, index) => (
                <Cell
                  key={index}
                  fill="hsl(var(--primary))"
                  fillOpacity={entry.active ? 1 : 0.4}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <button
        className={`${btnBase} w-full px-4 py-2 text-sm bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]`}
      >
        Set Goal
      </button>
    </div>
  )
}
