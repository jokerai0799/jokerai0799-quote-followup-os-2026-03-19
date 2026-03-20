import type { Metadata } from 'next'
import { DM_Mono, Instrument_Serif } from 'next/font/google'
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
  title: 'QuoteFollowUp',
  description: 'Quote follow-up software for trades and service businesses.',
  openGraph: {
    title: 'QuoteFollowUp',
    description: 'Quote follow-up software for trades and service businesses.',
    url: 'https://quotefollowup.online',
    siteName: 'QuoteFollowUp',
    type: 'website',
    images: [
      {
        url: '/og-homepage.jpg',
        width: 1280,
        height: 719,
        alt: 'QuoteFollowUp homepage preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuoteFollowUp',
    description: 'Quote follow-up software for trades and service businesses.',
    images: ['/og-homepage.jpg'],
  },
  icons: {
    icon: [
      { url: '/brand/favicon.svg', type: 'image/svg+xml' },
      { url: '/brand/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/brand/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/brand/favicon-32.png'],
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${dmMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-100 text-slate-950">
        <div className="min-h-full flex flex-col">
          <div className="flex-1">{children}</div>
          <footer className="border-t border-slate-200 bg-slate-50">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <p>QuoteFollowUp</p>
              <p>
                Support:{' '}
                <a href="mailto:quotefollowup@outlook.com" className="font-medium text-slate-700 underline-offset-4 transition hover:text-slate-950 hover:underline">
                  quotefollowup@outlook.com
                </a>
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
