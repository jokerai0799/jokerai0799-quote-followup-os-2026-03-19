import type { Metadata } from 'next'
import Link from 'next/link'
import { Analytics } from '@vercel/analytics/next'
import { DM_Mono, Instrument_Serif } from 'next/font/google'
import { seoPageLinks } from '@/lib/seo-pages'
import './globals.css'

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
  metadataBase: new URL('https://quotefollowup.online'),
  title: {
    default: 'Quote Follow-Up Software for Trades & Service Businesses | QuoteFollowUp',
    template: '%s | QuoteFollowUp',
  },
  description: 'Track quotes, follow up on time, and win more work with simple quote follow-up software for trades and service businesses.',
  applicationName: 'QuoteFollowUp',
  category: 'business software',
  alternates: {
    canonical: 'https://quotefollowup.online',
  },
  openGraph: {
    title: 'Quote Follow-Up Software for Trades & Service Businesses | QuoteFollowUp',
    description: 'Track quotes, follow up on time, and win more work with simple quote follow-up software for trades and service businesses.',
    url: 'https://quotefollowup.online',
    siteName: 'QuoteFollowUp',
    type: 'website',
    images: [
      {
        url: '/og-homepage.jpg',
        width: 1280,
        height: 551,
        alt: 'QuoteFollowUp homepage preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quote Follow-Up Software for Trades & Service Businesses | QuoteFollowUp',
    description: 'Track quotes, follow up on time, and win more work with simple quote follow-up software for trades and service businesses.',
    images: ['/og-homepage.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/brand/favicon.svg', type: 'image/svg+xml' },
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
    name: 'QuoteFollowUp',
    url: 'https://quotefollowup.online',
    email: 'quotefollowup@outlook.com',
    logo: 'https://quotefollowup.online/google-search-logo.png',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'QuoteFollowUp',
    url: 'https://quotefollowup.online',
    description: 'Track quotes, follow up on time, and win more work with simple quote follow-up software for trades and service businesses.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QuoteFollowUp',
    image: 'https://quotefollowup.online/google-search-logo.png',
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
    url: 'https://quotefollowup.online',
    description: 'Track quotes, follow up on time, and win more work with simple quote follow-up software for trades and service businesses.',
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
          <footer className="border-t border-slate-200 bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-1 text-sm text-slate-500">
                  <p>QuoteFollowUp</p>
                  <p>
                    Support:{' '}
                    <a href="mailto:quotefollowup@outlook.com" className="font-medium text-slate-700 underline-offset-4 transition hover:text-slate-950 hover:underline">
                      quotefollowup@outlook.com
                    </a>
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Related pages</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
                    {seoPageLinks.map((page) => (
                      <Link key={page.href} href={page.href} className="underline-offset-4 transition hover:text-slate-950 hover:underline">
                        {page.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
