import type { Metadata } from 'next'
import {
  Inter,
  Space_Grotesk,
  DM_Sans,
  Syne,
  Manrope,
  IBM_Plex_Sans,
  JetBrains_Mono,
  IBM_Plex_Mono,
  Fira_Code,
} from 'next/font/google'
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

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Anti-shadcn Theme Studio',
  description: 'Generate personality-first shadcn themes with AI rules',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en" className={[
        inter.variable, spaceGrotesk.variable, dmSans.variable,
        syne.variable, manrope.variable, ibmPlexSans.variable,
        jetbrainsMono.variable, ibmPlexMono.variable, firaCode.variable,
      ].join(' ')}>
      <body style={{ height: '100vh', overflow: 'hidden', margin: 0, padding: 0 }}>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  )
}
