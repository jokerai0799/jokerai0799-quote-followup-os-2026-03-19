import Link from 'next/link'
import { auth } from '@/auth'
import { QuoteTable } from '@/components/ui'
import { getMetrics, getQuotes } from '@/lib/quotes'

export default async function QuotesPage() {
  const session = await auth()
  const quotes = await getQuotes(session?.user?.id)
  const metrics = getMetrics(quotes)

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Quotes</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950">Pipeline management</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">Track every quote, adjust follow-up cadence, and keep ownership of the close.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Tracked</p>
            <p className="mt-1 text-xl font-semibold text-slate-950">{metrics.totalQuotes}</p>
          </div>
          <Link href="/quotes/new" className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
            Add quote
          </Link>
        </div>
      </div>
      <QuoteTable quotes={quotes} />
    </section>
  )
}
