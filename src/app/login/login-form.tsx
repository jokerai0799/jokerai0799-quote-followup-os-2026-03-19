'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { loginAction, type LoginState } from './actions'

const initialState: LoginState = {}

type Notice = {
  tone: 'success' | 'warning'
  message: string
}

export function LoginForm({ notice }: { notice?: Notice | null }) {
  const [state, formAction] = useFormState(loginAction, initialState)

  return (
    <form action={formAction} className="space-y-5">
      {notice ? (
        <div className={notice.tone === 'success'
          ? 'rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900'
          : 'rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900'}>
          {notice.message}
        </div>
      ) : null}
      <div>
        <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-500"
        />
      </div>
      <div>
        <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-500"
        />
      </div>
      {state.error ? <p className="text-sm text-rose-400">{state.error}</p> : null}
      <SubmitButton />
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      className="w-full rounded-xl border border-sky-500 bg-sky-600 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
    >
      {pending ? 'Signing in…' : 'Sign in'}
    </button>
  )
}
