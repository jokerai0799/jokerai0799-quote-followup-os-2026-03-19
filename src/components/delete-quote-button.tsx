'use client'

import { useTransition } from 'react'
import { deleteQuoteAction } from '@/app/actions'

export function DeleteQuoteButton({ quoteId, compact = false }: { quoteId: string; compact?: boolean }) {
  const [pending, startTransition] = useTransition()

  const className = compact
    ? 'rounded-md border border-rose-300 bg-rose-50 px-2.5 py-1.5 text-[11px] font-medium text-rose-700 transition hover:border-rose-400 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60'
    : 'inline-flex items-center justify-center rounded-xl border border-rose-300 bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700 transition hover:border-rose-400 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60'

  return (
    <button
      type="button"
      disabled={pending}
      className={className}
      onClick={() => {
        const confirmed = window.confirm('Delete this quote? This cannot be undone.')
        if (!confirmed) return

        startTransition(async () => {
          await deleteQuoteAction(quoteId)
        })
      }}
    >
      {pending ? 'Deleting…' : 'Delete quote'}
    </button>
  )
}
