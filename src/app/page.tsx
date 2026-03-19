import Link from 'next/link'
import { ChaseList, MetricCard, QuoteTable } from '@/components/ui'
import { formatCurrency, getDailyChaseList, getMetrics, getQuotes } from '@/lib/quotes'

export default async function HomePage() {
  const quotes = await getQuotes()
  const metrics = getMetrics(quotes)
  const chaseList = getDailyChaseList(quotes).map(({ quote }) => quote)

  return (
    <main className="min-h-screen bg-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-zinc-950 px-6 py-8 text-white shadow-xl sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">
                Quote Follow-Up OS
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                Stop letting quotes go cold.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
                A lean quote-chasing system for small service businesses. Track every quote,
                see who needs a follow-up today, and keep the pipeline moving without buying a bloated CRM.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/quotes/new"
                className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
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
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total quotes"
            value={String(metrics.totalQuotes)}
            subtext="All live and closed records in the workspace"
          />
          <MetricCard
            label="Value at risk"
            value={formatCurrency(metrics.valueAtRisk)}
            subtext="Open quotes that still need an outcome"
          />
          <MetricCard
            label="Won revenue"
            value={formatCurrency(metrics.wonRevenue)}
            subtext="Quotes already converted into booked work"
          />
          <MetricCard
            label="Overdue follow-ups"
            value={String(metrics.overdueCount)}
            subtext="Quotes that should have been chased already"
          />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-zinc-950">Pipeline</h2>
                  <p className="text-sm text-zinc-500">
                    Track every quote, status, and next follow-up in one place.
                  </p>
                </div>
                <Link
                  href="/quotes"
                  className="text-sm font-medium text-zinc-700 underline-offset-4 hover:text-zinc-950 hover:underline"
                >
                  View full quotes page
                </Link>
              </div>
              <QuoteTable quotes={quotes} />
            </div>
          </div>

          <aside className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-zinc-950">Today’s chase list</h2>
              <p className="text-sm text-zinc-500">
                Ready-to-send nudges for quotes that need action now.
              </p>
            </div>
            {chaseList.length ? (
              <ChaseList quotes={chaseList.slice(0, 3)} />
            ) : (
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 shadow-sm">
                Nothing is due today. Add a sent quote or tighten the follow-up cadence.
              </div>
            )}
            <Link
              href="/chase-list"
              className="inline-flex rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950"
            >
              See full chase list
            </Link>
          </aside>
        </section>
      </div>
    </main>
  )
}
