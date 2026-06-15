import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'easy-3dkit + Next.js',
  description: 'App Router example: a 3D hero rendered client-side behind server-rendered content.',
}

export const viewport: Viewport = {
  themeColor: '#07080f',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
