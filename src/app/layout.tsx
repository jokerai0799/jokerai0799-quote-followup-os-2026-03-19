import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { DM_Mono, Instrument_Serif } from 'next/font/google'
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, DEFAULT_TWITTER_IMAGE, SITE_NAME, SITE_URL } from '@/lib/site'
import './globals.css'
import { AppFooter } from '@/components/app-footer'

const instrumentSerif = Instrument_Serif({
  variable: '--font-brand-serif',
  subsets: ['latin'],
  weight: '400',
})

const dmMono = DM_Mono({
  variable: '--font-brand-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Quote Follow-Up Software for Trades & Service Businesses | QuoteFollowUp',
    template: '%s | QuoteFollowUp',
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  category: 'business software',
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'Quote Follow-Up Software for Trades & Service Businesses | QuoteFollowUp',
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'QuoteFollowUp social preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quote Follow-Up Software for Trades & Service Businesses | QuoteFollowUp',
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_TWITTER_IMAGE],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/brand/favicon.svg', type: 'image/svg+xml' },
      { url: '/brand/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/brand/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/favicon.ico'],
  },
}

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    email: 'quotefollowup@outlook.com',
    logo: `${SITE_URL}/brand/quote-followup-logo-on-white.svg`,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    image: `${SITE_URL}/brand/logo-512.png`,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Quote management and follow-up software',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '29.99',
      priceCurrency: 'GBP',
    },
    audience: {
      '@type': 'BusinessAudience',
      audienceType: 'Trades and service businesses',
    },
    featureList: [
      'Track quotes in one place',
      'See follow-ups due today',
      'Manage quote status and pipeline',
      'Keep a repeatable follow-up process for small service teams',
    ],
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
  },
]

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${dmMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-100 text-slate-950">
        {structuredData.map((entry, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
          />
        ))}
        <div className="min-h-full flex flex-col">
          <div className="flex-1">{children}</div>
          <AppFooter />
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
