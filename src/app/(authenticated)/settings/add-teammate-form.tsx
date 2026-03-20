'use client'

import { useFormState } from 'react-dom'
import { addTeammateAction, type AddTeammateState } from './actions'

const initialState: AddTeammateState = {}

export function AddTeammateForm() {
  const [state, formAction] = useFormState(addTeammateAction, initialState)

  return (
    <form action={formAction} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Team access</p>
      <h3 className="mt-2 text-xl font-semibold text-slate-950">Add teammate to workspace</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        This adds an existing account to your workspace. It does not change your own profile details.
      </p>

      <label className="mt-5 block text-sm font-medium text-slate-700">
        Teammate email
        <input
          name="email"
          type="email"
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-sky-500"
          placeholder="name@company.com"
          required
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-slate-700">
        Role
        <select
          name="role"
          defaultValue="member"
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-sky-500"
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
      </label>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        If they do not have an account yet, ask them to sign up first. Full email invite flow can come next.
      </p>

      {state.error ? <p className="mt-4 text-sm text-rose-600">{state.error}</p> : null}
      {state.success ? <p className="mt-4 text-sm text-emerald-600">{state.success}</p> : null}

      <button className="mt-5 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800" type="submit">
        Add teammate to workspace
      </button>
    </form>
  )
}
