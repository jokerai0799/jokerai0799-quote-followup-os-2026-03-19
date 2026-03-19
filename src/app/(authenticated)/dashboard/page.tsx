import Link from 'next/link'
import { auth } from '@/auth'
import { ChaseList, QuoteTable } from '@/components/ui'
import { DashboardMetrics } from '@/components/dashboard-metrics'
import { formatCurrency, getDailyChaseList, getMetrics, getQuotes } from '@/lib/quotes'
import { findUserById } from '@/lib/users'
import { ensureWorkspaceForUser, getWorkspaceDisplayName } from '@/lib/workspaces'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) {
    return null
  }

  const user = await findUserById(session.user.id)
  const workspace = user
    ? await ensureWorkspaceForUser({ userId: user.id, name: user.name, email: user.email, seedStarter: false })
    : null
  const displayWorkspaceName = getWorkspaceDisplayName(workspace, user)
  const quotes = await getQuotes(session.user.id)
  const metrics = getMetrics(quotes)
  const chaseList = getDailyChaseList(quotes).map(({ quote }) => quote)
  const isEmptyWorkspace = quotes.length === 0

  return (
    <>
      <section className="rounded-[2rem] border border-slate-800 bg-[#0F172A] px-6 py-8 text-white shadow-xl sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-sky-300">Workspace</p>
            <h1 className="mt-3 font-serif text-4xl italic tracking-tight sm:text-5xl">{displayWorkspaceName}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              {isEmptyWorkspace
                ? 'This is your clean workspace. Add your first quote to start building your pipeline and chase list.'
                : 'Track every quote, see what needs following up today, and keep your pipeline moving without guesswork.'}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Open pipeline</p>
              <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(metrics.valueAtRisk)}</p>
              <p className="mt-2 text-sm text-slate-400">Value still live in this workspace.</p>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Quotes tracked</p>
              <p className="mt-2 text-2xl font-semibold text-white">{metrics.totalQuotes}</p>
              <p className="mt-2 text-sm text-slate-400">All records in this workspace.</p>
            </div>
            <div className="sm:col-span-2 flex flex-wrap gap-3">
              <Link
                href="/quotes/new"
                className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-200 !text-slate-950"
              >
                Add quote
              </Link>
              <Link
                href="/chase-list"
                className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
              >
                Open chase list
              </Link>
            </div>
          </div>
        </div>
      </section>

      {isEmptyWorkspace ? (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Fresh workspace</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">You are starting with a clean slate.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Add your first quote to populate the dashboard, chase list, and follow-up metrics.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/quotes/new" className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
                Add first quote
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <>
          <DashboardMetrics {...metrics} />

          <section className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
            <div className="space-y-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950">Pipeline</h2>
                  <p className="text-sm text-slate-500">Track every quote, status, value, and next follow-up in one place.</p>
                </div>
                <Link href="/quotes" className="text-sm font-medium text-slate-700 underline-offset-4 hover:text-slate-950 hover:underline">
                  View all quotes
                </Link>
              </div>
              <QuoteTable quotes={quotes} />
            </div>

            <aside className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">Today’s chase list</h2>
                <p className="text-sm text-slate-500">Ready-to-send nudges for quotes that need attention now.</p>
              </div>
              {chaseList.length ? (
                <ChaseList quotes={chaseList.slice(0, 3)} />
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
                  Nothing is due today. Add a sent quote or tighten the follow-up cadence.
                </div>
              )}
              <Link
                href="/playbook"
                className="inline-flex rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
              >
                Review the follow-up playbook
              </Link>
            </aside>
          </section>
        </>
      )}
    </>
  )
}
