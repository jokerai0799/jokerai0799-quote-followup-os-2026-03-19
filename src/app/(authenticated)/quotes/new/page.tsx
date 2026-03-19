import Link from 'next/link'
import { createQuote } from '@/app/actions'
import { QuoteForm } from '@/components/quote-form'

export default function NewQuotePage() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-950">Add quote</h2>
          <p className="text-sm text-zinc-500">Create a new quote record and start tracking its follow-up cadence.</p>
        </div>
        <Link
          href="/quotes"
          className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950"
        >
          Back to quotes
        </Link>
      </div>
      <QuoteForm action={createQuote} submitLabel="Create quote" />
    </section>
  )
}
