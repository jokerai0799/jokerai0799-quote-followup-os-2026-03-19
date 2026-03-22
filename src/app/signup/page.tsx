import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { BrandLogo } from '@/components/brand-logo'
import { SignupForm } from './signup-form'

export const metadata = {
  title: 'Sign up',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const session = await auth()
  if (session?.user) {
    redirect('/dashboard')
  }

  const { ref } = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0D1520] px-4 py-12">
      <div className="w-full max-w-xl space-y-6 rounded-[2rem] border border-slate-800 bg-[#162033] p-8 shadow-[0_20px_80px_rgba(2,6,23,0.45)]">
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <BrandLogo compact />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-50">Create your account</h1>
            <p className="text-sm text-slate-400">
              Set up your workspace and start tracking quotes, follow-ups, and booked work in one place.
            </p>
            <p className="text-xs text-sky-300/90">Start with a 7-day trial, then upgrade only if you want to keep using it.</p>
          </div>
        </div>

        <SignupForm referralCode={ref ?? ''} />

        <p className="text-center text-xs text-slate-500">
          By signing up, you’ll create a login for this workspace. Want to look around first?{' '}
          <Link href={ref ? `/?ref=${encodeURIComponent(ref)}` : '/'} className="font-medium !text-sky-400 underline-offset-4 transition hover:!text-sky-300 hover:underline">
            Back to homepage
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
