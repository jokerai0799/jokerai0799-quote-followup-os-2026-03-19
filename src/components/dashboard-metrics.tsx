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
    { label: 'Open pipeline', value: formatCurrency(valueAtRisk, currencyCode), hint: 'Live quote value still in play', href: '/quotes?view=open' },
    { label: 'Needs attention', value: String(overdueCount), hint: 'Quotes waiting on follow-up', href: '/quotes?view=attention' },
    { label: 'Quotes tracked', value: String(totalQuotes), hint: 'All records in this workspace', href: '/quotes' },
    { label: 'Won revenue', value: formatCurrency(wonRevenue, currencyCode), hint: `Closed business · ${winRate}% win rate`, href: '/quotes?status=won' },
  ]

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Link
          key={card.label}
          href={card.href}
          className="rounded-3xl border border-slate-300/90 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
        >
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">{card.label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{card.value}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">{card.hint}</p>
        </Link>
      ))}
    </section>
  )
}
