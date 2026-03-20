'use client'

import { useFormState } from 'react-dom'
import { removeTeammateAction, type RemoveMemberState } from './actions'

const initialState: RemoveMemberState = {}

export function RemoveMemberButton({ memberUserId, disabled = false }: { memberUserId: string; disabled?: boolean }) {
  const [state, formAction] = useFormState(removeTeammateAction, initialState)

  return (
    <form action={formAction} className="flex flex-col items-end gap-2">
      <input type="hidden" name="memberUserId" value={memberUserId} />
      <button
        type="submit"
        disabled={disabled}
        className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Remove
      </button>
      {state.error ? <p className="text-right text-xs text-rose-600">{state.error}</p> : null}
      {state.success ? <p className="text-right text-xs text-emerald-600">{state.success}</p> : null}
    </form>
  )
}
