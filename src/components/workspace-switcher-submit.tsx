'use client'

import { useFormStatus } from 'react-dom'

export function WorkspaceSwitcherSubmit({
  label,
  meta,
  active,
}: {
  label: string
  meta: string
  active: boolean
}) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={active
        ? 'flex w-full items-center justify-between rounded-xl border border-sky-200 bg-sky-50 px-3 py-2.5 text-left transition disabled:cursor-wait disabled:opacity-75'
        : 'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-75'}
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-slate-950">{label}</span>
        <span className="mt-0.5 block text-xs text-slate-500">{meta}</span>
      </span>
      {pending ? (
        <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
          Switching…
        </span>
      ) : active ? (
        <span className="rounded-full border border-sky-200 bg-white px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-sky-700">
          Active
        </span>
      ) : null}
    </button>
  )
}
