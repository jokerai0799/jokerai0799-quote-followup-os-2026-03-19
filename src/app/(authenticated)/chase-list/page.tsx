import { ChaseList } from '@/components/ui'
import { getDailyChaseList, getQuotes } from '@/lib/quotes'

export default async function ChaseListPage() {
  const quotes = await getQuotes()
  const chaseList = getDailyChaseList(quotes).map(({ quote }) => quote)

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Daily chase list</h2>
        <p className="text-sm text-zinc-500">Quotes that need attention today, with a ready-to-send message prompt.</p>
      </div>
      {chaseList.length ? (
        <ChaseList quotes={chaseList} />
      ) : (
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 shadow-sm">No follow-ups are due today.</div>
      )}
    </section>
  )
}
