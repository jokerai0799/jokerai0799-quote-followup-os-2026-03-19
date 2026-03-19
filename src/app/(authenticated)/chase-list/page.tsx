import Link from 'next/link'
import { ChaseList } from '@/components/ui'
import { getDailyChaseList, getQuotes } from '@/lib/quotes'

export default async function ChaseListPage() {
  const quotes = await getQuotes()
  const chaseList = getDailyChaseList(quotes).map(({ quote }) => quote)

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Chase list</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950">Daily follow-up queue</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">Focus the team on the quotes that need attention now, with a message ready to send.</p>
        </div>
        <Link href="/playbook" className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950">
          View playbook
        </Link>
      </div>
      {chaseList.length ? (
        <ChaseList quotes={chaseList} />
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">No follow-ups are due today.</div>
      )}
    </section>
  )
}
