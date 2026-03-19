import Link from 'next/link'
import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { updateQuote } from '@/app/actions'
import { QuoteForm } from '@/components/quote-form'
import { getQuote } from '@/lib/quotes'

export default async function EditQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const { id } = await params
  const quote = await getQuote(id, session?.user?.id)

  if (!quote) {
    notFound()
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-950">Edit quote</h2>
          <p className="text-sm text-zinc-500">Update the quote details, status, or follow-up cadence.</p>
        </div>
        <Link
          href="/quotes"
          className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950"
        >
          Back to quotes
        </Link>
      </div>
      <QuoteForm action={updateQuote.bind(null, id)} quote={quote} submitLabel="Save changes" />
    </section>
  )
}
