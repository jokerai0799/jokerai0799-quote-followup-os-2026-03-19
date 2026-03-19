import { notFound } from 'next/navigation'
import { QuoteForm } from '@/components/quote-form'
import { updateQuote } from '@/app/actions'
import { buildFollowUpSchedule, formatDate, getQuote, renderTemplate } from '@/lib/quotes'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function EditQuotePage({ params }: PageProps) {
  const { id } = await params
  const quote = await getQuote(id)

  if (!quote) {
    notFound()
  }

  const action = updateQuote.bind(null, quote.id)
  const schedule = buildFollowUpSchedule(quote.sentDate, quote.followUpOffsets)

  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Edit quote</h2>
          <p className="text-sm text-zinc-500">Update the quote status, sent date, and chase cadence.</p>
        </div>
        <QuoteForm action={action} quote={quote} submitLabel="Save changes" />
      </section>

      <aside className="space-y-4">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Follow-up schedule</h3>
          <div className="mt-4 space-y-3">
            {schedule.length ? (
              schedule.map((item) => (
                <div key={item.step} className="rounded-2xl bg-zinc-50 p-3 text-sm text-zinc-700">
                  Step {item.step}: {formatDate(item.dueDate)} <span className="text-zinc-400">(+{item.offset} days)</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500">Set a sent date to generate the follow-up sequence.</p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Suggested message</h3>
          <p className="mt-4 rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-700">{renderTemplate(quote)}</p>
        </div>
      </aside>
    </div>
  )
}
