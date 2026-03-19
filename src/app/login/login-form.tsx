'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { loginAction, type LoginState } from './actions'

const initialState: LoginState = {}

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, initialState)

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="text-sm font-medium text-zinc-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-zinc-700" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400"
        />
      </div>
      {state.error ? <p className="text-sm text-rose-600">{state.error}</p> : null}
      <SubmitButton />
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      className="w-full rounded-xl bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
    >
      {pending ? 'Signing in…' : 'Sign in'}
    </button>
  )
}
