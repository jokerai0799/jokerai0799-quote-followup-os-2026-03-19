import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { BrandLogo } from '@/components/brand-logo'

type PageProps = {
  params: Promise<{ code: string }>
}

function withRef(path: string, ref?: string) {
  if (!ref) return path
  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}ref=${encodeURIComponent(ref)}`
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
  const session = await auth()
  const { code } = await params

  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0D1520] px-4 py-12 text-white">
      <div className="w-full max-w-3xl rounded-[2rem] border border-slate-800 bg-[#162033] p-8 shadow-[0_20px_80px_rgba(2,6,23,0.45)]">
        <div className="flex justify-center">
          <BrandLogo />
        </div>
        <div className="mt-8 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-sky-400">QuoteFollowUp</p>
          <h1 className="mt-4 font-serif text-5xl italic tracking-tight text-slate-50">
            Quote follow-up software for trades and service businesses
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300">
            Track every quote, follow up on time, and turn more estimates into booked work with a simple system built for small service teams.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-sky-500/20 bg-sky-500/10 px-5 py-4 text-center text-sm text-sky-100">
          You’re visiting a partner link. Learn about the product first, then create your workspace when you’re ready.
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={withRef('/', code)}
            className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            View homepage
          </Link>
          <Link
            href={withRef('/signup', code)}
            className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
          >
            Create workspace
          </Link>
          <Link
            href={withRef('/login', code)}
            className="rounded-xl border border-white/12 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/25 hover:bg-white/5 hover:text-white"
          >
            Log in
          </Link>
        </div>
      </div>
    </main>
  )
}
