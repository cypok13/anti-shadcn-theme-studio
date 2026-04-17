import type { Metadata } from 'next'
import { Inter, Space_Grotesk, DM_Sans } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Anti-shadcn Theme Studio',
  description: 'Generate personality-first shadcn themes with AI rules',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${dmSans.variable}`}>
      <body style={{ height: '100vh', overflow: 'hidden', margin: 0, padding: 0 }}>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  )
}
