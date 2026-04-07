import type { Metadata } from 'next'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import './globals.css'

export const metadata: Metadata = {
  title: 'Anti-shadcn Theme Studio',
  description: 'Generate personality-first shadcn themes with AI rules',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ height: '100vh', overflow: 'hidden', margin: 0, padding: 0 }}>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  )
}
