import { QuoteForm } from '@/components/quote-form'
import { createQuote } from '@/app/actions'

export default function NewQuotePage() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Add quote</h2>
        <p className="text-sm text-zinc-500">Create a new quote record and define its chase cadence.</p>
      </div>
      <QuoteForm action={createQuote} submitLabel="Create quote" />
    </section>
  )
}
