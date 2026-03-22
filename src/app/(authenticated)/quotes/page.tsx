import Link from 'next/link'
import { auth } from '@/auth'
import { QuoteTable } from '@/components/ui'
import { requireWorkspaceUsageAccess } from '@/lib/access'
import { getChaseState, getQuotes } from '@/lib/quotes'

const QUOTES_PAGE_SIZE = 24

type PageProps = {
  searchParams: Promise<{ status?: string; view?: string; page?: string }>
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

function getPageNumber(page?: string) {
  const parsed = Number.parseInt(page ?? '1', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

function buildQuotesHref(page: number, status?: string, view?: string) {
  const params = new URLSearchParams()
  if (status) params.set('status', status)
  if (view) params.set('view', view)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `/quotes?${query}` : '/quotes'
}

export default async function QuotesPage({ searchParams }: PageProps) {
  const session = await auth()
  if (!session?.user?.id) {
    return null
  }

  const access = await requireWorkspaceUsageAccess(session.user.id)
  const { status, view, page } = await searchParams
  const quotes = await getQuotes(session.user.id)
  const filteredQuotes = filterQuotes(quotes, status, view)
  const copy = getViewCopy(status, view)

  const totalPages = Math.max(1, Math.ceil(filteredQuotes.length / QUOTES_PAGE_SIZE))
  const currentPage = Math.min(getPageNumber(page), totalPages)
  const pageStart = (currentPage - 1) * QUOTES_PAGE_SIZE
  const paginatedQuotes = filteredQuotes.slice(pageStart, pageStart + QUOTES_PAGE_SIZE)

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
        </div>
      </div>

      <QuoteTable quotes={paginatedQuotes} currencyCode={access.workspace?.currencyCode ?? 'GBP'} />

      {filteredQuotes.length > QUOTES_PAGE_SIZE ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-slate-900">Page {currentPage} of {totalPages}</p>
          <div className="flex flex-wrap items-center gap-2">
            {currentPage > 1 ? (
              <Link href={buildQuotesHref(currentPage - 1, status, view)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950">
                Previous
              </Link>
            ) : null}

            <div className="flex flex-wrap items-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1
                const isActive = pageNumber === currentPage
                return (
                  <Link
                    key={pageNumber}
                    href={buildQuotesHref(pageNumber, status, view)}
                    className={isActive
                      ? 'inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-slate-950 bg-slate-100 px-3 text-sm font-semibold text-slate-950'
                      : 'inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-slate-300 px-3 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950'}
                  >
                    {pageNumber}
                  </Link>
                )
              })}
            </div>

            {currentPage < totalPages ? (
              <Link href={buildQuotesHref(currentPage + 1, status, view)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950">
                Next
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  )
}
