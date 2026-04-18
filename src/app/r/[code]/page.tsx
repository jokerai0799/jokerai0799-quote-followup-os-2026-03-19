import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { DEFAULT_OG_IMAGE, DEFAULT_TWITTER_IMAGE, SITE_URL } from '@/lib/site'

type PageProps = {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params
  return {
    title: 'QuoteFollowUp',
    description: 'Quote follow-up software for trades and service businesses.',
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: 'QuoteFollowUp',
      description: 'Quote follow-up software for trades and service businesses.',
      url: `${SITE_URL}/r/${encodeURIComponent(code)}`,
      type: 'website',
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'QuoteFollowUp',
      description: 'Quote follow-up software for trades and service businesses.',
      images: [DEFAULT_TWITTER_IMAGE],
    },
  }
}

export default async function ReferralLandingPage({ params }: PageProps) {
  const { code } = await params
  redirect(`/?ref=${encodeURIComponent(code)}`)
}
