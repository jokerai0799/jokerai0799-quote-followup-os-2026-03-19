import Link from 'next/link'
import { auth } from '@/auth'
import { ChaseList, QuoteTable } from '@/components/ui'
import { DashboardMetrics } from '@/components/dashboard-metrics'
import { formatCurrency, getDailyChaseList, getMetrics, getQuotes, getStatusBreakdown } from '@/lib/quotes'
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
  const statusBreakdown = getStatusBreakdown(quotes)
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
            {!isEmptyWorkspace ? (
              <div className="mt-5 flex flex-wrap gap-2.5">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200">
                  {metrics.totalQuotes} tracked
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200">
                  {chaseList.length} need follow-up
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200">
                  {metrics.wonCount} won
                </span>
              </div>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/quotes?view=open" className="rounded-2xl border border-slate-600/90 bg-slate-900/55 p-4 shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition hover:border-slate-500 hover:bg-slate-900/65">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Open pipeline</p>
              <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(metrics.valueAtRisk)}</p>
              <div className="mt-2 flex items-center justify-between gap-3 text-sm text-slate-400">
                <span>Value still live in this workspace.</span>
                <span className="text-xs font-medium text-slate-300">View</span>
              </div>
            </Link>
            <Link href="/quotes" className="rounded-2xl border border-slate-600/90 bg-slate-900/55 p-4 shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition hover:border-slate-500 hover:bg-slate-900/65">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Quotes tracked</p>
              <p className="mt-2 text-2xl font-semibold text-white">{metrics.totalQuotes}</p>
              <div className="mt-2 flex items-center justify-between gap-3 text-sm text-slate-400">
                <span>All records in this workspace.</span>
                <span className="text-xs font-medium text-slate-300">View</span>
              </div>
            </Link>
            <div className="sm:col-span-2 flex flex-wrap gap-3">
              <Link href="/quotes/new" className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-200 !text-slate-950">
                Add quote
              </Link>
              <Link href="/chase-list" className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20">
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
              <Link href="/quotes/new" className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 !text-white">
                Add first quote
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="space-y-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Overview</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Performance snapshot</h2>
            </div>
            <DashboardMetrics {...metrics} />
          </section>

          <section className="space-y-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Focus</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">What needs attention</h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <Link href="/quotes?view=closed" className="rounded-3xl border border-slate-300/90 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Conversion</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{metrics.winRate}%</p>
                <div className="mt-2 flex items-center justify-between gap-3 text-sm text-slate-500">
                  <span>Current win rate from closed quotes</span>
                  <span className="text-xs font-medium text-slate-500">View</span>
                </div>
              </Link>
              <Link href="/quotes?view=closed" className="rounded-3xl border border-slate-300/90 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Closed quotes</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{metrics.wonCount + metrics.lostCount}</p>
                <div className="mt-2 flex items-center justify-between gap-3 text-sm text-slate-500">
                  <span>{metrics.wonCount} won · {metrics.lostCount} lost</span>
                  <span className="text-xs font-medium text-slate-500">View</span>
                </div>
              </Link>
              <Link href="/quotes?view=attention" className="rounded-3xl border border-slate-300/90 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Follow-up load</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{chaseList.length}</p>
                <div className="mt-2 flex items-center justify-between gap-3 text-sm text-slate-500">
                  <span>Quotes due or overdue right now</span>
                  <span className="text-xs font-medium text-slate-500">View</span>
                </div>
              </Link>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
            <div className="space-y-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Pipeline</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">Quote overview</h2>
                  <p className="text-sm text-slate-500">Track every quote, status, value, and next follow-up in one place.</p>
                </div>
                <Link href="/quotes" className="text-sm font-medium text-slate-700 underline-offset-4 hover:text-slate-950 hover:underline">
                  View all quotes
                </Link>
              </div>
              <QuoteTable quotes={quotes} />
            </div>

            <aside className="space-y-4">
              <div className="rounded-3xl border border-slate-300/90 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Pipeline mix</p>
                    <p className="mt-2 text-sm text-slate-500">Jump into each status bucket directly.</p>
                  </div>
                  <Link href="/quotes" className="text-sm font-medium text-slate-700 underline-offset-4 hover:text-slate-950 hover:underline">
                    View all
                  </Link>
                </div>
                <div className="mt-4 space-y-2">
                  {statusBreakdown.filter((item) => item.count > 0).map((item) => (
                    <Link key={item.status} href={`/quotes?status=${encodeURIComponent(item.status)}`} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 px-3 py-2.5 text-sm transition hover:border-slate-300 hover:bg-slate-50">
                      <span className="text-slate-600">{item.status}</span>
                      <span className="font-medium text-slate-950">{item.count} · {formatCurrency(item.value)}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Queue</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">Today’s chase list</h2>
                  <p className="text-sm text-slate-500">Showing the top urgent items here. Open the full queue for filters and the complete list.</p>
                </div>
                <Link href="/chase-list" className="text-sm font-medium text-slate-700 underline-offset-4 hover:text-slate-950 hover:underline">
                  View full queue
                </Link>
              </div>
              {chaseList.length ? (
                <ChaseList quotes={chaseList.slice(0, 3)} />
              ) : (
                <div className="rounded-3xl border border-slate-300/90 bg-white p-6 text-sm text-slate-500 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                  Nothing is due today. Add a sent quote or tighten the follow-up cadence.
                </div>
              )}
              <Link href="/playbook" className="inline-flex rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950">
                Review the follow-up playbook
              </Link>
            </aside>
          </section>
        </>
      )}
    </>
  )
}
