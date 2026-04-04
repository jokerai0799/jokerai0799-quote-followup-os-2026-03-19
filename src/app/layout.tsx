import type { Metadata } from 'next'
import Link from 'next/link'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { DM_Mono, Instrument_Serif } from 'next/font/google'
import { seoPageLinks } from '@/lib/seo-pages'
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/site'
import './globals.css'
import { BrandLogo } from '@/components/brand-logo'

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
        width: 1280,
        height: 551,
        alt: 'QuoteFollowUp homepage preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quote Follow-Up Software for Trades & Service Businesses | QuoteFollowUp',
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
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
    name: SITE_NAME,
    url: SITE_URL,
    email: 'quotefollowup@outlook.com',
    logo: `${SITE_URL}/brand/google-search-logo.svg`,
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
    image: `${SITE_URL}/brand/google-search-logo.svg`,
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
          <footer className="border-t border-slate-200 bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <div className="space-y-5">
                <div className="space-y-3 text-sm text-slate-500">
                  <BrandLogo variant="dark" className="!text-inherit" />
                  <p>
                    Support:{' '}
                    <a href="mailto:quotefollowup@outlook.com" className="font-medium text-slate-700 underline-offset-4 transition hover:text-slate-950 hover:underline">
                      quotefollowup@outlook.com
                    </a>
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">Related pages</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-400">
                    {seoPageLinks.map((page) => (
                      <Link key={page.href} href={page.href} className="transition hover:text-slate-600">
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
        <SpeedInsights />
      </body>
    </html>
  )
}
