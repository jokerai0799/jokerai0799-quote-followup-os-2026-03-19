import Link from 'next/link'
import { type WorkspaceCurrency } from '@/lib/currency'
import { formatCurrency } from '@/lib/quotes'

type DashboardMetricsProps = {
  totalQuotes: number
  valueAtRisk: number
  wonRevenue: number
  overdueCount: number
  winRate: number
  currencyCode?: WorkspaceCurrency
}

export function DashboardMetrics({ totalQuotes, valueAtRisk, wonRevenue, overdueCount, winRate, currencyCode = 'GBP' }: DashboardMetricsProps) {
  const cards = [
    { label: 'Open pipeline', value: formatCurrency(valueAtRisk, currencyCode), hint: 'Quotes still in play', href: '/quotes?view=open' },
    { label: 'Won revenue', value: formatCurrency(wonRevenue, currencyCode), hint: 'Closed business so far', href: '/quotes?status=won' },
    { label: 'Quotes tracked', value: String(totalQuotes), hint: 'All records in workspace', href: '/quotes' },
    { label: 'Win rate', value: `${winRate}%`, hint: 'Won vs lost closed quotes', href: '/quotes?view=closed' },
    { label: 'Needs attention', value: String(overdueCount), hint: 'Overdue follow-ups', href: '/quotes?view=attention' },
  ]

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <Link
          key={card.label}
          href={card.href}
          className="rounded-3xl border border-slate-300/90 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
        >
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">{card.label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{card.value}</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-500">{card.hint}</p>
            <span className="text-xs font-medium text-slate-500">View</span>
          </div>
        </Link>
      ))}
    </section>
  )
}
