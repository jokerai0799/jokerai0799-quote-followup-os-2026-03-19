import type { ReactNode } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { signOutAction } from '@/app/actions'
import { BrandLogo } from '@/components/brand-logo'
import { Nav } from '@/components/nav'
import { findUserById } from '@/lib/users'
import { getDailyChaseList, getQuotes } from '@/lib/quotes'
import { ensureWorkspaceForUser, getWorkspaceDisplayName } from '@/lib/workspaces'

export default async function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  const user = await findUserById(session.user.id)
  const workspace = user
    ? await ensureWorkspaceForUser({ userId: user.id, name: user.name, email: user.email, seedStarter: false })
    : null
  const displayWorkspaceName = getWorkspaceDisplayName(workspace, user)
  const quotes = await getQuotes(session.user.id)
  const dueCount = getDailyChaseList(quotes).length

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-800 bg-[#162033] text-white shadow-[0_1px_0_rgba(255,255,255,0.04),0_4px_24px_rgba(0,0,0,0.35)]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
              <BrandLogo href="/dashboard" showTagline={false} />
              <Nav />
            </div>

            <div className="flex flex-wrap items-center gap-3 xl:justify-end">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] !text-white text-white">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
                {dueCount} due today
              </div>

              <div className="hidden min-w-[240px] rounded-xl border border-slate-500 bg-slate-900/55 px-4 py-2 lg:block">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] !text-white/80 text-white/80">Current workspace</p>
                <p className="truncate text-sm font-semibold !text-white text-white">{displayWorkspaceName}</p>
              </div>

              <Link
                href="/quotes/new"
                className="inline-flex items-center justify-center rounded-lg border border-sky-500 bg-sky-600 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] !text-white text-white transition hover:border-sky-400 hover:bg-sky-500"
              >
                New quote
              </Link>

              <form action={signOutAction}>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-500 bg-transparent px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] !text-white text-white transition hover:border-slate-300 hover:bg-white/5"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">{children}</div>
      </div>
    </main>
  )
}
