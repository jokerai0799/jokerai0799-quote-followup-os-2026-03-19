import type { Metadata } from 'next'
import { SeoLandingPage } from '@/components/seo-landing-page'
import { seoPageLinks } from '@/lib/seo-pages'
import { DEFAULT_OG_IMAGE, SITE_URL } from '@/lib/site'

const path = '/electrician-quote-follow-up-software'
const title = 'Electrician Quote Follow-Up Software'
const description =
  'Electrician quote follow-up software for electrical businesses that want clearer quote tracking, better follow-up timing, and more booked work.'

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

export default function ElectricianQuoteFollowUpSoftwarePage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  return (
    <SeoLandingPage
      pagePath={path}
      searchParams={searchParams}
      eyebrow="Electrician Quote Follow-Up Software"
      title="Electrician quote follow-up software for electrical contractors"
      intro="Track electrical quotes, see who needs following up next, and keep more live jobs moving with a simple workflow built for quote-heavy teams."
      fitTitle="For electricians who need more control after the quote goes out"
      fitBody="Electrical businesses often quote for upgrades, installs, testing, and repair work across many live enquiries at once. This page is for teams that want better visibility without taking on a full CRM rollout."
      description="QuoteFollowUp helps electricians manage quote status, next follow-up dates, and due-today chasing so electrical quotes do not slip through the cracks."
      benefits={[
        'Keep electrical quotes organised in one place',
        'See overdue and due-today follow-ups clearly',
        'Track quote progress from sent to won or lost',
        'Give office staff and small teams a simple daily workflow',
      ]}
      faqs={[
        {
          question: 'Does this work for electrical contractors and small firms?',
          answer: 'Yes. It is aimed at electricians and electrical businesses that send quotes regularly and need a cleaner follow-up process.',
        },
        {
          question: 'What problem does it solve for electrical quotes?',
          answer: 'It helps stop quotes from going cold by showing what was sent, what is still live, and who needs following up next.',
        },
        {
          question: 'Is this more focused than a normal CRM?',
          answer: 'Yes. The product is deliberately focused on quote tracking and follow-up rather than trying to cover every sales or operations workflow.',
        },
      ]}
      relatedPages={seoPageLinks.filter((page) => page.href !== path)}
    />
  )
}
