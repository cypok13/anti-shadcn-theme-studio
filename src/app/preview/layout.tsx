import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Theme Preview',
}

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{`html, body { height: 100%; overflow: hidden; }`}</style>
      </head>
      <body style={{ margin: 0, padding: 0, height: '100%', overflow: 'hidden', background: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
        {children}
      </body>
    </html>
  )
}
