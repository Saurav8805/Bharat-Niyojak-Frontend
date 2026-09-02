import type { Metadata } from 'next'
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
      </head>
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  )
}
