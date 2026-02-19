import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://psychedelicbeacon.com'),
  title: {
    default: 'Psychedelic Beacon — Find Ketamine & Psychedelic Therapy Near You',
    template: '%s | Psychedelic Beacon',
  },
  description:
    'Find verified ketamine clinics and psychedelic therapy providers near you. 600+ clinics across 34 states. Compare modalities, pricing, and insurance coverage.',
  openGraph: {
    type: 'website',
    siteName: 'Psychedelic Beacon',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Psychedelic Beacon' }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="font-sans bg-neutral-50 text-neutral-900 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
