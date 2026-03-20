import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { BrandLogo } from '@/components/brand-logo'
import { createSignupChallenge } from '@/lib/signup-guard'
import { SignupForm } from './signup-form'

export const metadata = {
  title: 'Sign up | QuoteFollowUp',
}

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const session = await auth()
  if (session?.user) {
    redirect('/dashboard')
  }

  const challenge = createSignupChallenge()
  const { ref } = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0D1520] px-4 py-12">
      <div className="w-full max-w-xl space-y-6 rounded-[2rem] border border-slate-800 bg-[#162033] p-8 shadow-[0_20px_80px_rgba(2,6,23,0.45)]">
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <BrandLogo compact />
          </div>
          <div className="space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-sky-400">QuoteFollowUp</p>
            <h1 className="font-serif text-4xl italic tracking-tight text-slate-50">Create your workspace account</h1>
            <p className="text-sm text-slate-400">
              Start with quote follow-up software built for trades and service businesses that need cleaner follow-up and more booked work.
            </p>
            <p className="text-xs text-sky-300/90">Start with a 7-day workspace trial, then upgrade only if you want to keep using your own workspace.</p>
          </div>
        </div>

        <SignupForm challengeCode={challenge.code} challengeToken={challenge.token} issuedAt={challenge.issuedAt} referralCode={ref ?? ''} />

        <p className="text-center text-xs text-slate-500">
          By signing up, you’ll create a login for this workspace. Want to look around first?{' '}
          <Link href="/" className="font-medium !text-sky-400 underline-offset-4 transition hover:!text-sky-300 hover:underline">
            Back to homepage
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
