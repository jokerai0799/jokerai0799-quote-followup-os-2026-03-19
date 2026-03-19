import { redirect } from 'next/navigation'
import { auth } from '@/auth'
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
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">Quote Follow-Up OS</p>
          <h1 className="text-2xl font-semibold text-zinc-950">Sign in</h1>
          <p className="text-sm text-zinc-500">Use the workspace credentials configured for this environment.</p>
        </div>
        <LoginForm />
        <p className="text-center text-xs text-zinc-400">
          Need access? Update the credentials in <span className="font-mono text-zinc-600">.env</span> and rerun <span className="font-mono text-zinc-600">npm run db:seed</span>.
        </p>
      </div>
    </main>
  )
}
