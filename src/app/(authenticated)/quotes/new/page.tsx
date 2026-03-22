import Link from 'next/link'
import { auth } from '@/auth'
import { createQuote } from '@/app/actions'
import { QuoteForm } from '@/components/quote-form'
import { type WorkspaceCurrency } from '@/lib/currency'
import { requireWorkspaceUsageAccess } from '@/lib/access'

export const metadata = {
  title: 'New quote | QuoteFollowUp',
}

export default async function NewQuotePage() {
  const session = await auth()
  let currencyCode: WorkspaceCurrency = 'GBP'

  if (session?.user?.id) {
    const access = await requireWorkspaceUsageAccess(session.user.id)
    currencyCode = access.workspace?.currencyCode ?? 'GBP'
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Quotes</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950">Add a new quote</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">Capture the quote once, then let the dashboard and chase list do the follow-up work.</p>
        </div>
        <Link href="/quotes" className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950">
          Back to quotes
        </Link>
      </div>

      <QuoteForm action={createQuote} submitLabel="Save quote" currencyCode={currencyCode} />
    </section>
  )
}
