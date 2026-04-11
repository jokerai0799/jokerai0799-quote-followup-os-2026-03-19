import type { Metadata } from 'next'
import { SeoLandingPage } from '@/components/seo-landing-page'
import { seoPageLinks } from '@/lib/seo-pages'
import { DEFAULT_OG_IMAGE, SITE_URL } from '@/lib/site'

const path = '/quote-chasing-software'
const title = 'Quote Chasing Software'
const description =
  'Quote chasing software for trades and service businesses that want a clearer way to track quotes, follow up on time, and win more work.'

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

export default function QuoteChasingSoftwarePage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  return (
    <SeoLandingPage
      pagePath={path}
      searchParams={searchParams}
      eyebrow="Quote Chasing Software"
      title="Quote chasing software for small teams that need better follow-through"
      intro="If your main problem is not creating quotes but chasing them properly, you need a system that shows what is due, what is overdue, and what still has a chance of closing."
      fitTitle="For businesses that keep losing track after the quote is sent"
      fitBody="Many businesses are less concerned with creating quotes than with chasing them properly afterward. This is for teams that want a simpler way to stay on top of follow-up and keep opportunities moving."
      description="QuoteFollowUp helps trades and service businesses chase quotes on time, keep next actions visible, and build a simple process that turns more sent quotes into booked work."
      benefits={[
        'See which quotes need chasing today',
        'Track next follow-up dates without spreadsheets',
        'Keep overdue quotes visible instead of forgotten',
        'Use a simple system focused on quote follow-through',
      ]}
      faqs={[
        {
          question: 'What is quote chasing software?',
          answer: 'It is software that helps you follow up sent quotes in a more organised way so live opportunities do not get forgotten.',
        },
        {
          question: 'How is it different from quoting software?',
          answer: 'Quoting software often focuses on creating the quote. Quote chasing software focuses on what happens after the quote is sent.',
        },
        {
          question: 'Who is it useful for?',
          answer: 'It is useful for trades and service businesses that send quotes regularly and want a more reliable process for following them up.',
        },
      ]}
      relatedPages={seoPageLinks.filter((page) => page.href !== path)}
    />
  )
}
