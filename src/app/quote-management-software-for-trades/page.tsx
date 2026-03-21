import type { Metadata } from 'next'
import { SeoLandingPage } from '@/components/seo-landing-page'
import { seoPageLinks } from '@/lib/seo-pages'

export const metadata: Metadata = {
  title: 'Quote Management Software for Trades',
  description:
    'Quote management software for trades that need a simple pipeline, clear follow-up dates, and better visibility into what is still live.',
  alternates: {
    canonical: 'https://quotefollowup.online/quote-management-software-for-trades',
  },
}

export default function QuoteManagementSoftwareForTradesPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  return (
    <SeoLandingPage
      searchParams={searchParams}
      eyebrow="Quote Management Software for Trades"
      title="Quote management software for trades and small service teams"
      intro="Track what has been sent, what needs following up, and which jobs are still in play with a simpler quote management workflow built for trade businesses."
      fitTitle="For trade businesses that need quote visibility without a heavy CRM"
      fitBody="Many trade businesses search for quote management software when the real need is a clearer pipeline and a better follow-up rhythm. This page speaks directly to that buying intent."
      description="QuoteFollowUp gives trade businesses a focused system to manage quote status, follow-up dates, and today’s chase list so nothing important gets missed after the quote goes out."
      benefits={[
        'Manage quote status in a clear, readable pipeline',
        'Keep next follow-up dates visible for every live opportunity',
        'See open pipeline and due-today work at a glance',
        'Use a focused trade workflow instead of a bloated general CRM',
      ]}
      faqs={[
        {
          question: 'What does quote management software do?',
          answer:
            'It helps you keep track of quotes after they are sent, including current status, next steps, and which opportunities still need action.',
        },
        {
          question: 'Is this built for trades?',
          answer:
            'Yes. It is aimed at trade and service businesses such as plumbing, electrical, cleaning, property, and similar teams that quote regularly.',
        },
        {
          question: 'Why not use a full CRM instead?',
          answer:
            'If the main pain is quote follow-through and pipeline visibility, a focused system can be easier to adopt and easier to keep current than a much larger CRM.',
        },
      ]}
      relatedPages={seoPageLinks.filter((page) => page.href !== '/quote-management-software-for-trades')}
    />
  )
}
