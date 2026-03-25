import type { Metadata } from 'next'
import { SeoLandingPage } from '@/components/seo-landing-page'
import { seoPageLinks } from '@/lib/seo-pages'
import { DEFAULT_OG_IMAGE, SITE_URL } from '@/lib/site'

const path = '/plumber-quote-follow-up-software'
const title = 'Plumber Quote Follow-Up Software'
const description =
  'Plumber quote follow-up software for plumbing businesses that want to track quotes, chase the right jobs on time, and win more booked work.'

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${SITE_URL}${path}`,
  },
  openGraph: {
    title: `${title} | QuoteFollowUp`,
    description,
    url: `${SITE_URL}${path}`,
    type: 'website',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${title} | QuoteFollowUp`,
    description,
    images: [DEFAULT_OG_IMAGE],
  },
}

export default function PlumberQuoteFollowUpSoftwarePage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  return (
    <SeoLandingPage
      pagePath={path}
      searchParams={searchParams}
      eyebrow="Plumber Quote Follow-Up Software"
      title="Plumber quote follow-up software for busy plumbing businesses"
      intro="If your plumbing business sends quote after quote and too many go quiet, you need a simpler way to track what was sent, who needs chasing, and what is still live."
      fitTitle="Built for plumbing quotes that need steady follow-up"
      fitBody="Plumbing businesses often quote fast, then lose visibility once the quote is sent. This page is for plumbers who want a practical follow-up system without moving the whole business into a heavy CRM."
      description="QuoteFollowUp helps plumbing businesses track quote status, next follow-up dates, and today’s chase list so more plumbing quotes turn into booked work."
      benefits={[
        'Track every plumbing quote in one place',
        'See which plumbing jobs need following up today',
        'Keep quote status visible from sent to won or lost',
        'Use a simple workflow that fits small plumbing teams',
      ]}
      faqs={[
        {
          question: 'Is this only for large plumbing firms?',
          answer: 'No. It is designed for small and growing plumbing businesses that quote regularly and need a simple follow-up process.',
        },
        {
          question: 'What does it help with after a plumbing quote is sent?',
          answer: 'It helps you stay on top of follow-up dates, see what needs chasing today, and avoid losing track of live jobs.',
        },
        {
          question: 'Why not just manage plumbing quotes in a spreadsheet?',
          answer: 'A spreadsheet can store the data, but it usually does not give you a clean daily chase list or an easy quote workflow for the team.',
        },
      ]}
      relatedPages={seoPageLinks.filter((page) => page.href !== path)}
    />
  )
}
