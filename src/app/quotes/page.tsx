import { QuoteTable } from '@/components/ui'
import { getQuotes } from '@/lib/quotes'

export default async function QuotesPage() {
  const quotes = await getQuotes()

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Quotes</h2>
        <p className="text-sm text-zinc-500">Track every quote, status, and next follow-up in one place.</p>
      </div>
      <QuoteTable quotes={quotes} />
    </section>
  )
}
