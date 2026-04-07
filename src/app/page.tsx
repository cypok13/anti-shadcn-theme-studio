import { Suspense } from 'react'
import { AppShell } from '@/components/shell/AppShell'

export default function HomePage() {
  return (
    <Suspense>
      <AppShell />
    </Suspense>
  )
}
