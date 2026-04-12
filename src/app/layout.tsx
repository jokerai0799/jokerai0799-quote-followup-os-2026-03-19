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

const catalystLink = {
  href: 'https://quotechaser.online',
  label: 'Catalyst',
  description: 'Explore the broader Quote Chaser workflow project.',
}

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
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
                <div className="space-y-5">
                  <div className="space-y-3 text-sm text-slate-500">
                    <BrandLogo variant="dark" className="!text-inherit" />
                    <p className="max-w-xl leading-6 text-slate-600">
                      Simple quote follow-up software for trades and service businesses that want clearer pipeline visibility and more consistent follow-through.
                    </p>
                    <p className="leading-6">
                      Support:{' '}
                      <a
                        href="mailto:quotefollowup@outlook.com"
                        className="break-all font-medium text-slate-700 underline-offset-4 transition hover:text-slate-950 hover:underline sm:break-normal"
                      >
                        quotefollowup@outlook.com
                      </a>
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                    <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">Also from us</p>
                    <div className="mt-2 space-y-1.5">
                      <a
                        href={catalystLink.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-sky-700"
                      >
                        {catalystLink.label}
                        <span aria-hidden="true" className="text-slate-400">↗</span>
                      </a>
                      <p className="text-sm leading-6 text-slate-600">{catalystLink.description}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm sm:p-5">
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">Related pages</p>
                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-[13px] text-slate-500 sm:gap-x-4 sm:text-sm">
                    {seoPageLinks.map((page) => (
                      <Link key={page.href} href={page.href} className="transition hover:text-slate-900">
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
