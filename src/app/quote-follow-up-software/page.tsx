import type { Metadata } from 'next'
import { SeoLandingPage } from '@/components/seo-landing-page'
import { seoPageLinks } from '@/lib/seo-pages'
import { DEFAULT_OG_IMAGE, SITE_URL } from '@/lib/site'

const path = '/quote-follow-up-software'
const title = 'Quote Follow-Up Software'
const description =
  'Quote follow-up software for trades and service businesses that want to track sent quotes, follow up on time, and win more booked work.'

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

export default function QuoteFollowUpSoftwarePage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  return (
    <SeoLandingPage
      pagePath={path}
      searchParams={searchParams}
      eyebrow="Quote Follow-Up Software"
      title="Quote follow-up software for trades and service businesses"
      intro="Keep every sent quote visible, know who needs chasing today, and build a repeatable follow-up process without adopting a bloated CRM."
      fitTitle="Built for businesses that lose work when quotes go quiet"
      fitBody="If you send quotes regularly but rely on memory, spreadsheets, or buried messages to follow up, it becomes easy for good jobs to go cold. This page is for teams that want a simpler, more reliable follow-up system."
      description="QuoteFollowUp gives you one place to track sent quotes, next follow-up dates, current status, and today’s chase list so your team can act quickly and keep more estimates moving toward booked work."
      benefits={[
        'Track sent quotes and next follow-up dates in one place',
        'See overdue and due-today quotes instantly',
        'Give small teams a clear daily follow-up workflow',
        'Avoid paying for a larger CRM when the core problem is quote follow-through',
      ]}
      faqs={[
        {
          question: 'What is quote follow-up software?',
          answer:
            'It is software focused on helping you track sent quotes, know when to follow up, and keep a consistent sales process after the quote is delivered.',
        },
        {
          question: 'Who is it best for?',
          answer:
            'It is best for trade and service businesses that send estimates regularly and want a cleaner way to manage what has been sent, what is due, and what has been won or lost.',
        },
        {
          question: 'Why not just use a spreadsheet?',
          answer:
            'Spreadsheets can hold the data, but they usually do not give you a clear daily chase list or a simple workflow for staying on top of follow-ups.',
        },
      ]}
      relatedPages={seoPageLinks.filter((page) => page.href !== '/quote-follow-up-software')}
    />
  )
}
