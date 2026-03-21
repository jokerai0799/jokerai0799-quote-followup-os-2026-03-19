import Link from 'next/link'
import { auth } from '@/auth'
import { QuoteTable } from '@/components/ui'
import { requireWorkspaceUsageAccess } from '@/lib/access'
import { getChaseState, getMetrics, getQuotes } from '@/lib/quotes'

type PageProps = {
  searchParams: Promise<{ status?: string; view?: string }>
}

function filterQuotes(quotes: Awaited<ReturnType<typeof getQuotes>>, status?: string, view?: string) {
  if (status) {
    return quotes.filter((quote) => quote.status === status)
  }

  if (view === 'open') {
    return quotes.filter((quote) => !['won', 'lost'].includes(quote.status))
  }

  if (view === 'closed') {
    return quotes.filter((quote) => ['won', 'lost'].includes(quote.status))
  }

  if (view === 'attention') {
    return quotes.filter((quote) => {
      const chase = getChaseState(quote)
      return chase.overdue || chase.dueToday
    })
  }

  return quotes
}

function getViewCopy(status?: string, view?: string) {
  if (status === 'won') {
    return {
      title: 'Won quotes',
      body: 'Review the quotes that have already converted into business.',
    }
  }

  if (view === 'open') {
    return {
      title: 'Open pipeline',
      body: 'Review every quote that is still active and needs progressing.',
    }
  }

  if (view === 'closed') {
    return {
      title: 'Closed quotes',
      body: 'See the quotes that have already landed in a won or lost outcome.',
    }
  }

  if (view === 'attention') {
    return {
      title: 'Needs attention',
      body: 'These quotes are due or overdue for follow-up right now.',
    }
  }

  return {
    title: 'Pipeline management',
    body: 'Track every quote, adjust follow-up cadence, and keep ownership of the close.',
  }
}

export default async function QuotesPage({ searchParams }: PageProps) {
  const session = await auth()
  if (!session?.user?.id) {
    return null
  }

  await requireWorkspaceUsageAccess(session.user.id)
  const { status, view } = await searchParams
  const quotes = await getQuotes(session.user.id)
  const filteredQuotes = filterQuotes(quotes, status, view)
  const metrics = getMetrics(quotes)
  const copy = getViewCopy(status, view)

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-300/90 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)] lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Quotes</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950">{copy.title}</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">{copy.body}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/quotes" className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950">
            View all
          </Link>
          <div className="rounded-2xl border border-slate-300/90 bg-slate-50 px-4 py-3 shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Tracked</p>
            <p className="mt-1 text-xl font-semibold text-slate-950">{filteredQuotes.length}</p>
          </div>
          <Link
            href="/quotes/new"
            className="inline-flex items-center justify-center rounded-xl border border-sky-500 bg-sky-600 px-3.5 py-2 text-sm font-semibold !text-white text-white leading-none shadow-[0_6px_16px_rgba(14,165,233,0.18)] transition hover:border-sky-400 hover:bg-sky-500 hover:!text-white"
          >
            New quote
          </Link>
        </div>
      </div>
      <QuoteTable quotes={filteredQuotes} />
    </section>
  )
}
