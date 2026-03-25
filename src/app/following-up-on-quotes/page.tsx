import type { Metadata } from 'next'
import { SeoLandingPage } from '@/components/seo-landing-page'
import { seoPageLinks } from '@/lib/seo-pages'
import { DEFAULT_OG_IMAGE, SITE_URL } from '@/lib/site'

const path = '/following-up-on-quotes'
const title = 'Following Up on Quotes'
const description =
  'A practical page for businesses looking for a better way of following up on quotes, keeping next actions visible, and turning more quotes into booked work.'

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

export default function FollowingUpOnQuotesPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  return (
    <SeoLandingPage
      pagePath={path}
      searchParams={searchParams}
      eyebrow="Following Up on Quotes"
      title="Following up on quotes without losing track of live jobs"
      intro="If your business is decent at sending quotes but inconsistent at following them up, you need a simple system that shows what is due, what is overdue, and who still needs a reply."
      fitTitle="Built for teams that need a better quote follow-up habit"
      fitBody="Many businesses do not struggle to create quotes. They struggle to keep following up on quotes consistently once the day gets busy. This page targets that exact problem."
      description="QuoteFollowUp helps you stay on top of following up on quotes by keeping quote status, next follow-up dates, and today’s chase list visible in one simple workflow."
      benefits={[
        'See which quotes need following up today',
        'Keep next actions visible instead of buried in notes',
        'Track quote status from sent through won or lost',
        'Use a simple workflow that makes follow-up easier to repeat',
      ]}
      faqs={[
        {
          question: 'What is the best way of following up on quotes?',
          answer: 'The best approach is to keep a clear list of sent quotes, know the next follow-up date for each one, and make follow-up part of a repeatable daily process.',
        },
        {
          question: 'Why do quotes go cold so often?',
          answer: 'Quotes often go cold because there is no clear system showing what is still live, what is overdue, and who needs chasing next.',
        },
        {
          question: 'Does this replace quoting software?',
          answer: 'Not necessarily. It focuses on what happens after the quote is sent, which is often where businesses lose visibility and momentum.',
        },
      ]}
      relatedPages={seoPageLinks.filter((page) => page.href !== path)}
    />
  )
}
