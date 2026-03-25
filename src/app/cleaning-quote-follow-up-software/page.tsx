import type { Metadata } from 'next'
import { SeoLandingPage } from '@/components/seo-landing-page'
import { seoPageLinks } from '@/lib/seo-pages'
import { DEFAULT_OG_IMAGE, SITE_URL } from '@/lib/site'

const path = '/cleaning-quote-follow-up-software'
const title = 'Cleaning Quote Follow-Up Software'
const description =
  'Cleaning quote follow-up software for cleaning businesses that need simple quote tracking, clearer follow-up dates, and a better chase process.'

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

export default function CleaningQuoteFollowUpSoftwarePage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  return (
    <SeoLandingPage
      pagePath={path}
      searchParams={searchParams}
      eyebrow="Cleaning Quote Follow-Up Software"
      title="Cleaning quote follow-up software for service teams"
      intro="If your cleaning business is sending quotes for regular work, deep cleans, commercial contracts, or one-off jobs, you need an easy way to keep follow-up moving."
      fitTitle="Built for cleaning businesses that want more consistent follow-through"
      fitBody="Cleaning teams often work at speed and quote across many enquiries. This page is for businesses that want a focused quote workflow, not a large complicated CRM."
      description="QuoteFollowUp helps cleaning businesses track quote status, see who needs chasing today, and keep more cleaning quotes active until they are won or closed out."
      benefits={[
        'Track cleaning quotes and next follow-up dates clearly',
        'See today’s chase list without digging through emails',
        'Keep quote status visible across the pipeline',
        'Use a lightweight system that suits small cleaning teams',
      ]}
      faqs={[
        {
          question: 'Can this help with commercial and domestic cleaning quotes?',
          answer: 'Yes. It is useful anywhere your team sends quotes and needs a simple process for following them up consistently.',
        },
        {
          question: 'What does the chase list help with?',
          answer: 'It shows which quotes need action now so the team can follow up on time instead of relying on memory or scattered notes.',
        },
        {
          question: 'Is it suitable for small teams?',
          answer: 'Yes. It is built to be simple enough for smaller businesses that want clarity without extra complexity.',
        },
      ]}
      relatedPages={seoPageLinks.filter((page) => page.href !== path)}
    />
  )
}
