import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { BrandLogo } from '@/components/brand-logo'

export const metadata = {
  title: 'Check your email',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function CheckEmailPage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const session = await auth()
  if (session?.user) {
    redirect('/dashboard')
  }

  const { email } = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0D1520] px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-[2rem] border border-slate-800 bg-[#162033] p-8 text-center shadow-[0_20px_80px_rgba(2,6,23,0.45)]">
        <div className="flex justify-center">
          <BrandLogo compact />
        </div>
        <div className="space-y-3">
          <h1 className="font-serif text-4xl italic tracking-tight text-slate-50">Check your email</h1>
          <p className="text-sm leading-6 text-slate-300">
            We sent a verification link{email ? ` to ${email}` : ''}. Open it to activate your account, then log in.
          </p>
          <p className="text-xs text-slate-500">
            If you do not see it, check spam or promotions.
          </p>
        </div>
        <Link href="/login" className="inline-flex justify-center rounded-xl border border-sky-500 bg-sky-600 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white transition hover:bg-sky-500">
          Go to login
        </Link>
      </div>
    </main>
  )
}
