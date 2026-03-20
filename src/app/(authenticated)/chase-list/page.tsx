import Link from 'next/link'
import { auth } from '@/auth'
import { ChaseList } from '@/components/ui'
import { requireWorkspaceUsageAccess } from '@/lib/access'
import { getChaseState, getDailyChaseList, getQuotes } from '@/lib/quotes'

type PageProps = {
  searchParams: Promise<{ filter?: string }>
}

export default async function ChaseListPage({ searchParams }: PageProps) {
  const session = await auth()
  if (!session?.user?.id) {
    return null
  }

  await requireWorkspaceUsageAccess(session.user.id)
  const { filter } = await searchParams
  const quotes = await getQuotes(session.user.id)
  const fullChaseList = getDailyChaseList(quotes).map(({ quote }) => quote)
  const overdueQuotes = fullChaseList.filter((quote) => getChaseState(quote).overdue)
  const dueTodayQuotes = fullChaseList.filter((quote) => getChaseState(quote).dueToday)

  const chaseList = filter === 'overdue' ? overdueQuotes : filter === 'today' ? dueTodayQuotes : fullChaseList

  const filters = [
    { key: 'all', label: 'All needing attention', count: fullChaseList.length, href: '/chase-list' },
    { key: 'overdue', label: 'Overdue', count: overdueQuotes.length, href: '/chase-list?filter=overdue' },
    { key: 'today', label: 'Due today', count: dueTodayQuotes.length, href: '/chase-list?filter=today' },
  ]

  const activeFilter = filter === 'overdue' || filter === 'today' ? filter : 'all'

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Chase list</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950">Daily follow-up queue</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">Work through the quotes that need attention now, then filter by urgency when you need a tighter view.</p>
        </div>
        <Link href="/playbook" className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950">
          View playbook
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        {filters.map((item) => {
          const active = activeFilter === item.key
          return (
            <Link
              key={item.key}
              href={item.href}
              className={active
                ? 'rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium !text-white text-white'
                : 'rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950'}
            >
              {item.label} · {item.count}
            </Link>
          )
        })}
      </div>

      {chaseList.length ? (
        <ChaseList quotes={chaseList} />
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">Nothing matches this filter right now.</div>
      )}
    </section>
  )
}
