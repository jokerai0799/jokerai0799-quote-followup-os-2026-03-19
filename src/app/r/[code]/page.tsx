import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

type PageProps = {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params
  return {
    title: 'QuoteFollowUp',
    description: 'Quote follow-up software for trades and service businesses.',
    openGraph: {
      title: 'QuoteFollowUp',
      description: 'Quote follow-up software for trades and service businesses.',
      url: `https://quotefollowup.online/r/${encodeURIComponent(code)}`,
      type: 'website',
      images: ['/og-homepage.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'QuoteFollowUp',
      description: 'Quote follow-up software for trades and service businesses.',
      images: ['/og-homepage.jpg'],
    },
  }
}

export default async function ReferralLandingPage({ params }: PageProps) {
  const { code } = await params
  redirect(`/?ref=${encodeURIComponent(code)}`)
}
