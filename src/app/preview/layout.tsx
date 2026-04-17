import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Theme Preview',
}

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`html, body { height: 100%; overflow: hidden; }`}</style>
      {children}
    </>
  )
}
