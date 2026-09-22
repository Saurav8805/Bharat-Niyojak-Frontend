import type { Metadata } from 'next'
import AuthProvider from '@/components/AuthProvider'
import GoogleTranslate from '@/components/GoogleTranslate'
import './globals.css'

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
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Hide all Google Translate feedback popups */
            .VIpgJd-ZVi9od-aZ2wEe-wOHMyf,
            .VIpgJd-ZVi9od-aZ2wEe-OiiCO,
            .goog-te-spinner-pos,
            #goog-gt-tt,
            .goog-te-ftab,
            .goog-te-balloon-frame,
            .goog-te-menu-value,
            .goog-te-menu-frame,
            iframe[id^="goog-gt-"] {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
              pointer-events: none !important;
            }
          `
        }} />
      </head>
      <body className="bg-gray-50">
        <GoogleTranslate />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
