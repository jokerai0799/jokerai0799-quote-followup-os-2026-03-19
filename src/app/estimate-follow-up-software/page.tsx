import type { Metadata } from 'next'
import { SeoLandingPage } from '@/components/seo-landing-page'
import { seoPageLinks } from '@/lib/seo-pages'
import { DEFAULT_OG_IMAGE, SITE_URL } from '@/lib/site'

const path = '/estimate-follow-up-software'
const title = 'Estimate Follow-Up Software'
const description =
  'Estimate follow-up software for service teams that need to track estimates, see who to chase next, and win more work from existing enquiries.'

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

export default function EstimateFollowUpSoftwarePage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  return (
    <SeoLandingPage
      pagePath={path}
      searchParams={searchParams}
      eyebrow="Estimate Follow-Up Software"
      title="Estimate follow-up software for service businesses"
      intro="For teams that call them estimates instead of quotes, the problem is the same: once an estimate is sent, you need a simple way to keep follow-up on track."
      fitTitle="A practical system for estimate tracking and follow-up"
      fitBody="Some businesses talk about estimates rather than quotes, but they still need the same thing: a clear way to track what was sent, what needs follow-up next, and what is still live."
      description="QuoteFollowUp helps service businesses track estimates, monitor next actions, and keep a repeatable follow-up cadence so more enquiries become booked jobs instead of going stale."
      benefits={[
        'Keep sent estimates visible instead of losing them in inboxes and notes',
        'See which estimates need chasing today',
        'Track status from sent through won or lost',
        'Give your team a lighter workflow than a full CRM rollout',
      ]}
      faqs={[
        {
          question: 'Is estimate follow-up software different from quote follow-up software?',
          answer:
            'Usually it is the same core workflow. Different businesses use different language, but the need is still to track what was sent and when to follow up next.',
        },
        {
          question: 'Can this work for small service teams?',
          answer:
            'Yes. It is designed for small teams that want a clean, focused process rather than a large system with a lot of unused features.',
        },
        {
          question: 'What does it help improve?',
          answer:
            'It helps improve follow-through, visibility, and consistency after an estimate is sent, which can increase how many jobs get booked.',
        },
      ]}
      relatedPages={seoPageLinks.filter((page) => page.href !== '/estimate-follow-up-software')}
    />
  )
}
