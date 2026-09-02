import type { Metadata } from 'next'
import './globals.css'
import Galaxy from '@/components/Galaxy'

export const metadata: Metadata = {
  title: 'Bharat Niyojak - AI-Powered Civic Issue Reporting',
  description: 'One Photo. One Click. The Right Authority. Report civic issues with AI assistance.',
  keywords: ['civic issues', 'AI', 'smart city', 'complaint management', 'municipal services'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Galaxy 
          mouseRepulsion
          mouseInteraction
          density={1}
          glowIntensity={0.3}
          saturation={0}
          hueShift={140}
          twinkleIntensity={0.3}
          rotationSpeed={0.05}
          repulsionStrength={2}
          autoCenterRepulsion={0}
          starSpeed={0.25}
          speed={0.5}
          transparent={true}
        />
        {children}
      </body>
    </html>
  )
}
