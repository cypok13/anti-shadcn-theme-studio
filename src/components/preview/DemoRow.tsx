import { cn } from '@/lib/utils'

interface DemoRowProps {
  children: React.ReactNode
  className?: string
}

export function DemoRow({ children, className }: DemoRowProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {children}
    </div>
  )
}
