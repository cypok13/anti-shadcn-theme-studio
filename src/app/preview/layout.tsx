import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Theme Preview',
}

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{`html, body { overflow-y: auto !important; }`}</style>
      </head>
      <body style={{ margin: 0, padding: 0, background: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
        {children}
      </body>
    </html>
  )
}
