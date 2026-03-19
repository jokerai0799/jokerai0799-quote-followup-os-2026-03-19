import { ReactNode } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { signOutAction } from '@/app/actions'

export default async function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-zinc-100">
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-sm sm:px-6 lg:px-8">
          <Link href="/" className="font-semibold text-zinc-900">
            Quote Follow-Up OS
          </Link>
          <nav className="flex items-center gap-4 text-zinc-600">
            <Link className="transition hover:text-zinc-900" href="/quotes">
              Quotes
            </Link>
            <Link className="transition hover:text-zinc-900" href="/chase-list">
              Chase list
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-semibold text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">{children}</div>
      </div>
    </main>
  )
}
