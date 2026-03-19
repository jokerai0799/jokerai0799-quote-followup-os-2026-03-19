'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { updateQuoteStatusAction } from '@/app/actions'

type QuoteStatus = 'draft' | 'sent' | 'follow-up due' | 'replied' | 'won' | 'lost'

const statusOptions: Array<{ value: QuoteStatus; label: string }> = [
  { value: 'sent', label: 'Mark sent' },
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
}: {
  quoteId: string
  quoteTitle: string
  quoteEmail?: string
  status: QuoteStatus
  message: string
  compact?: boolean
}) {
  const [pending, startTransition] = useTransition()
  const mailtoHref = quoteEmail
    ? `mailto:${encodeURIComponent(quoteEmail)}?subject=${encodeURIComponent(`Following up on ${quoteTitle}`)}&body=${encodeURIComponent(message)}`
    : null

  return (
    <div className={compact ? 'flex flex-wrap justify-end gap-2' : 'flex flex-wrap gap-2'}>
      <button
        type="button"
        onClick={() => navigator.clipboard.writeText(message)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
      >
        Copy message
      </button>

      {mailtoHref ? (
        <Link
          href={mailtoHref}
          className="rounded-lg border border-sky-300 bg-sky-50 px-3 py-2 text-xs font-medium text-sky-700 transition hover:border-sky-400 hover:bg-sky-100 hover:text-sky-800"
        >
          Email client
        </Link>
      ) : null}

      {statusOptions
        .filter((option) => option.value !== status)
        .slice(0, compact ? 2 : statusOptions.length)
        .map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={pending}
            onClick={() => startTransition(async () => {
              await updateQuoteStatusAction(quoteId, option.value)
            })}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {option.label}
          </button>
        ))}
    </div>
  )
}
