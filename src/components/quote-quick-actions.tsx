'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { updateQuoteStatusAction } from '@/app/actions'
import { DeleteQuoteButton } from '@/components/delete-quote-button'

type QuoteStatus = 'draft' | 'sent' | 'due' | 'replied' | 'won' | 'lost'

const statusOptions: Array<{ value: QuoteStatus; label: string }> = [
  { value: 'sent', label: 'Mark sent' },
  { value: 'due', label: 'Mark due' },
  { value: 'replied', label: 'Mark replied' },
  { value: 'won', label: 'Mark won' },
  { value: 'lost', label: 'Mark lost' },
]

export function QuoteQuickActions({
  quoteId,
  quoteTitle,
  quoteEmail,
  status,
  message,
  compact = false,
  dense = false,
}: {
  quoteId: string
  quoteTitle: string
  quoteEmail?: string
  status: QuoteStatus
  message: string
  compact?: boolean
  dense?: boolean
}) {
  const [pending, startTransition] = useTransition()
  const mailtoHref = quoteEmail
    ? `mailto:${encodeURIComponent(quoteEmail)}?subject=${encodeURIComponent(`Following up on ${quoteTitle}`)}&body=${encodeURIComponent(message)}`
    : null

  const baseButtonClass = compact
    ? 'inline-flex min-h-10 w-full items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-semibold transition min-[380px]:w-auto'
    : dense
      ? 'rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition'
      : 'rounded-lg border px-3 py-2 text-xs font-medium transition'

  return (
    <div className={compact ? 'flex w-full flex-wrap gap-2' : dense ? 'flex flex-wrap gap-1.5' : 'flex flex-wrap gap-2'}>
      {mailtoHref ? (
        <Link
          href={mailtoHref}
          className={`${baseButtonClass} border-sky-300 bg-sky-50 text-sky-700 hover:border-sky-400 hover:bg-sky-100 hover:text-sky-800`}
        >
          Email client
        </Link>
      ) : null}

      {!compact
        ? statusOptions
            .filter((option) => option.value !== status)
            .map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await updateQuoteStatusAction(quoteId, option.value)
                  })
                }
                className={`${baseButtonClass} border-slate-300 text-slate-700 hover:border-slate-950 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {option.label}
              </button>
            ))
        : null}

      {!compact ? <DeleteQuoteButton quoteId={quoteId} compact={dense} /> : null}
    </div>
  )
}
