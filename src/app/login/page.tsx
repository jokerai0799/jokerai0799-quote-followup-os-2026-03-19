import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { BrandLogo } from '@/components/brand-logo'
import { LoginForm } from './login-form'

export const metadata = {
  title: 'Sign in | Quote Follow-Up OS',
}

export default async function LoginPage() {
  const session = await auth()
  if (session?.user) {
    redirect('/')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0D1520] px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-[2rem] border border-slate-800 bg-[#162033] p-8 shadow-[0_20px_80px_rgba(2,6,23,0.45)]">
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <BrandLogo compact />
          </div>
          <div className="space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-sky-400">Quote Follow-Up OS</p>
            <h1 className="font-serif text-4xl italic tracking-tight text-slate-50">Sign in</h1>
            <p className="text-sm text-slate-400">Use the workspace credentials configured for this environment.</p>
          </div>
        </div>
        <LoginForm />
        <p className="text-center text-xs text-slate-500">
          Need access? Update the credentials in <span className="font-mono text-slate-300">.env</span> and rerun{' '}
          <span className="font-mono text-slate-300">npm run db:seed</span>.
        </p>
      </div>
    </main>
  )
}
