import type { ReactNode } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { signOutAction } from '@/app/actions'
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
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
              <Link href="/dashboard" className="inline-flex items-center gap-3 text-slate-950">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-sm">
                  <svg viewBox="0 0 36 36" className="h-8 w-8" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="36" height="36" rx="8" fill="#1A2B42" />
                    <rect width="36" height="36" rx="8" fill="none" stroke="white" strokeWidth="0.8" opacity="0.08" />
                    <rect x="6" y="5" width="16" height="21" rx="2.5" fill="#243651" />
                    <rect x="6" y="5" width="16" height="21" rx="2.5" stroke="#2E4E74" strokeWidth="1.2" />
                    <polygon points="17,5 22,10 17,10" fill="#152030" />
                    <polyline points="17,5 17,10 22,10" stroke="#2E4E74" strokeWidth="1.2" strokeLinejoin="round" />
                    <rect x="9" y="13" width="6" height="1.8" rx="0.9" fill="#3B82F6" opacity="0.9" />
                    <rect x="9" y="16.5" width="9" height="1.8" rx="0.9" fill="#4B6A8A" opacity="0.6" />
                    <rect x="9" y="20" width="7" height="1.8" rx="0.9" fill="#4B6A8A" opacity="0.45" />
                    <line x1="23" y1="19" x2="31" y2="19" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" />
                    <polyline points="27.5,15.5 31.5,19 27.5,22.5" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="31.5" cy="19" r="1.6" fill="#60A5FA" />
                  </svg>
                </span>
                <span className="flex min-w-0 flex-col leading-none">
                  <span className="whitespace-nowrap font-serif text-xl italic tracking-tight text-slate-950">QuoteFollowUp</span>
                  <span className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">Workspace</span>
                </span>
              </Link>
              <Nav />
            </div>

            <div className="flex flex-wrap items-center gap-3 xl:justify-end">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {dueCount} due today
              </div>

              <div className="hidden min-w-[240px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 lg:block">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">Current workspace</p>
                <p className="truncate text-sm font-semibold text-slate-950">{displayWorkspaceName}</p>
              </div>

              <Link
                href="/quotes/new"
                className="inline-flex items-center justify-center rounded-lg border border-sky-600 bg-sky-600 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white transition hover:border-sky-500 hover:bg-sky-500"
              >
                New quote
              </Link>

              <form action={signOutAction}>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
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
