import Link from 'next/link'
import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { QuoteForm } from '@/components/quote-form'
import { updateQuote } from '@/app/actions'
import { requireWorkspaceUsageAccess } from '@/lib/access'
import { getQuote } from '@/lib/quotes'

export const metadata = {
  title: 'Edit quote | QuoteFollowUp',
}

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function EditQuotePage({ params }: PageProps) {
  const session = await auth()
  if (session?.user?.id) {
    await requireWorkspaceUsageAccess(session.user.id)
  }

  const { id } = await params
  const quote = await getQuote(id, session?.user?.id)

  if (!quote) {
    notFound()
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Quotes</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950">Edit quote</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">Update quote details, status, and follow-up cadence without losing history.</p>
        </div>
        <Link href="/quotes" className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950">
          Back to quotes
        </Link>
      </div>

      <QuoteForm action={updateQuote.bind(null, quote.id)} quote={quote} submitLabel="Save changes" />
    </section>
  )
}
