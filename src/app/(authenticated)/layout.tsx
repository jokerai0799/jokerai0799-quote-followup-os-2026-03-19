import type { ReactNode } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { signOutAction } from '@/app/actions'
import { BrandLogo } from '@/components/brand-logo'
import { Nav } from '@/components/nav'
import { getDailyChaseList, getQuotes } from '@/lib/quotes'

export default async function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  const quotes = await getQuotes()
  const dueCount = getDailyChaseList(quotes).length

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-800 bg-[#162033] shadow-[0_1px_0_rgba(255,255,255,0.04),0_4px_24px_rgba(0,0,0,0.35)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:gap-8">
            <BrandLogo />
            <Nav />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
              {dueCount} due {dueCount === 1 ? 'today' : 'today'}
            </div>

            <div className="hidden rounded-xl border border-slate-700 bg-slate-900/40 px-3 py-2 text-right sm:block">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Workspace</p>
              <p className="text-sm text-slate-200">{session.user.email}</p>
            </div>

            <Link
              href="/quotes/new"
              className="rounded-lg border border-sky-500 bg-sky-600 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white transition hover:border-sky-400 hover:bg-sky-500"
            >
              + New Quote
            </Link>

            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-lg border border-slate-700 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-300 transition hover:border-slate-500 hover:bg-white/5 hover:text-white"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">{children}</div>
      </div>
    </main>
  )
}
