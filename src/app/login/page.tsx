import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { BrandLogo } from '@/components/brand-logo'
import { LoginForm } from './login-form'

export const metadata = {
  title: 'Log in | QuoteFollowUp',
}

export default async function LoginPage() {
  const session = await auth()
  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0D1520] px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-[2rem] border border-slate-800 bg-[#162033] p-8 shadow-[0_20px_80px_rgba(2,6,23,0.45)]">
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <BrandLogo compact />
          </div>
          <div className="space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-sky-400">QuoteFollowUp</p>
            <h1 className="font-serif text-4xl italic tracking-tight text-slate-50">Log in to your workspace</h1>
            <p className="text-sm text-slate-400">Pick up your quote pipeline, chase list, and follow-up playbook.</p>
          </div>
        </div>
        <LoginForm />
        <p className="text-center text-xs text-slate-500">
          New here?{' '}
          <Link href="/signup" className="text-slate-300 underline-offset-4 hover:text-white hover:underline">
            Create an account
          </Link>{' '}
          or go back to the{' '}
          <Link href="/" className="text-slate-300 underline-offset-4 hover:text-white hover:underline">
            landing page
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
