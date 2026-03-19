import { formatCurrency } from '@/lib/quotes'

type DashboardMetricsProps = {
  totalQuotes: number
  valueAtRisk: number
  wonRevenue: number
  overdueCount: number
}

export function DashboardMetrics({ totalQuotes, valueAtRisk, wonRevenue, overdueCount }: DashboardMetricsProps) {
  const cards = [
    { label: 'Open pipeline', value: formatCurrency(valueAtRisk), hint: 'Quotes still in play' },
    { label: 'Won revenue', value: formatCurrency(wonRevenue), hint: 'Closed business so far' },
    { label: 'Quotes tracked', value: String(totalQuotes), hint: 'All records in workspace' },
    { label: 'Needs attention', value: String(overdueCount), hint: 'Overdue follow-ups' },
  ]

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">{card.label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{card.value}</p>
          <p className="mt-2 text-sm text-slate-500">{card.hint}</p>
        </div>
      ))}
    </section>
  )
}
