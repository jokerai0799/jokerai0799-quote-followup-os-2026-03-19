import Link from 'next/link'
import { type WorkspaceCurrency } from '@/lib/currency'
import { QuoteQuickActions } from '@/components/quote-quick-actions'
import { formatCurrency, formatDate, getChaseState, renderTemplate, type Quote, type QuoteStatus } from '@/lib/quotes'

export function StatusBadge({ status }: { status: QuoteStatus }) {
  const styles: Record<QuoteStatus, string> = {
    draft: 'bg-zinc-100 text-zinc-700',
    sent: 'bg-blue-100 text-blue-700',
    due: 'bg-amber-100 text-amber-800',
    replied: 'bg-violet-100 text-violet-700',
    won: 'bg-emerald-100 text-emerald-700',
    lost: 'bg-rose-100 text-rose-700',
  }

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>{status}</span>
}

export function MetricCard({ label, value, subtext }: { label: string; value: string; subtext: string }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-zinc-950">{value}</p>
      <p className="mt-2 text-sm text-zinc-500">{subtext}</p>
    </div>
  )
}

export function QuoteTable({ quotes, currencyCode = 'GBP' }: { quotes: Quote[]; currencyCode?: WorkspaceCurrency }) {
  return (
    <>
      <div className="grid gap-4 md:hidden">
        {quotes.map((quote) => {
          const chase = getChaseState(quote)
          return (
            <article key={quote.id} className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-zinc-950">{quote.clientName}</p>
                  <p className="mt-1 text-sm text-zinc-500">{quote.contactName || quote.email || 'No contact yet'}</p>
                </div>
                <StatusBadge status={quote.status} />
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="font-medium text-zinc-900">{quote.title}</p>
                  <p className="text-zinc-500">Sent {formatDate(quote.sentDate)}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 rounded-2xl bg-zinc-50 p-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Value</p>
                    <p className="mt-1 font-medium text-zinc-900">{formatCurrency(quote.value, currencyCode)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Next follow-up</p>
                    <p className="mt-1 font-medium text-zinc-900">{chase.nextDate ? formatDate(chase.nextDate) : '—'}</p>
                    {chase.overdue ? <div className="text-xs font-medium text-rose-600">Overdue</div> : null}
                    {chase.dueToday ? <div className="text-xs font-medium text-amber-600">Due today</div> : null}
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3 border-t border-zinc-100 pt-4">
                <Link className="inline-flex font-medium text-zinc-900 underline-offset-4 hover:underline" href={`/quotes/${quote.id}/edit`}>
                  Edit quote
                </Link>
                <QuoteQuickActions
                  quoteId={quote.id}
                  quoteTitle={quote.title}
                  quoteEmail={quote.email}
                  status={quote.status}
                  message={renderTemplate(quote)}
                  compact
                />
              </div>
            </article>
          )
        })}
      </div>

      <div className="hidden overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm md:block">
        <table className="min-w-full divide-y divide-zinc-200 text-sm">
          <thead className="bg-zinc-50 text-left text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Quote</th>
              <th className="px-4 py-3 font-medium">Value</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Next follow-up</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {quotes.map((quote) => {
              const chase = getChaseState(quote)
              return (
                <tr key={quote.id} className="align-top">
                  <td className="px-4 py-4">
                    <p className="font-medium text-zinc-900">{quote.clientName}</p>
                    <p className="text-zinc-500">{quote.contactName || quote.email || 'No contact yet'}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-zinc-900">{quote.title}</p>
                    <p className="text-zinc-500">Sent {formatDate(quote.sentDate)}</p>
                  </td>
                  <td className="px-4 py-4 font-medium text-zinc-900">{formatCurrency(quote.value, currencyCode)}</td>
                  <td className="px-4 py-4"><StatusBadge status={quote.status} /></td>
                  <td className="px-4 py-4 text-zinc-600">
                    {chase.nextDate ? formatDate(chase.nextDate) : '—'}
                    {chase.overdue ? <div className="text-xs font-medium text-rose-600">Overdue</div> : null}
                    {chase.dueToday ? <div className="text-xs font-medium text-amber-600">Due today</div> : null}
                  </td>
                  <td className="w-[220px] px-4 py-4 text-right">
                    <div className="flex flex-col items-end gap-1.5">
                      <Link className="font-medium text-zinc-900 underline-offset-4 hover:underline" href={`/quotes/${quote.id}/edit`}>
                        Edit
                      </Link>
                      <QuoteQuickActions
                        quoteId={quote.id}
                        quoteTitle={quote.title}
                        quoteEmail={quote.email}
                        status={quote.status}
                        message={renderTemplate(quote)}
                        compact
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export function ChaseList({ quotes }: { quotes: Quote[] }) {
  return (
    <div className="grid gap-4">
      {quotes.map((quote) => {
        const chase = getChaseState(quote)
        return (
          <div key={quote.id} className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-zinc-950">{quote.clientName}</h3>
                  <StatusBadge status={quote.status} />
                </div>
                <p className="mt-1 text-sm text-zinc-600">{quote.title}</p>
                <p className="mt-3 text-sm text-zinc-500">Next chase: {chase.nextDate ? formatDate(chase.nextDate) : '—'}</p>
              </div>
              <Link href={`/quotes/${quote.id}/edit`} className="shrink-0 text-sm font-medium text-zinc-700 underline-offset-4 transition hover:text-zinc-950 hover:underline">
                Edit
              </Link>
            </div>
            <div className="mt-4 md:max-w-md">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Suggested message</p>
              <p className="mt-2 rounded-2xl bg-zinc-50 p-3 text-sm text-zinc-700">{renderTemplate(quote)}</p>
            </div>
            <div className="mt-4 border-t border-zinc-100 pt-4">
              <QuoteQuickActions
                quoteId={quote.id}
                quoteTitle={quote.title}
                quoteEmail={quote.email}
                status={quote.status}
                message={renderTemplate(quote)}
                dense
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
