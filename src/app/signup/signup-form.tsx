'use client'

import Link from 'next/link'
import { useFormState, useFormStatus } from 'react-dom'
import { signupAction, type SignupState } from './actions'

const initialState: SignupState = {}

export function SignupForm({ challengeCode, challengeToken, issuedAt, referralCode = '' }: { challengeCode: string; challengeToken: string; issuedAt: number; referralCode?: string }) {
  const [state, formAction] = useFormState(signupAction, initialState)

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="challengeToken" value={challengeToken} />
      <input type="hidden" name="issuedAt" value={issuedAt} />
      <input type="hidden" name="referralCode" value={referralCode} />
      <div className="hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400" htmlFor="name">
            Name
          </label>
          <input id="name" name="name" type="text" required className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-500" />
        </div>
        <div>
          <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400" htmlFor="companyName">
            Company
          </label>
          <input id="companyName" name="companyName" type="text" required className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-500" />
        </div>
      </div>

      <div>
        <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400" htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" required className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-500" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400" htmlFor="password">
            Password
          </label>
          <input id="password" name="password" type="password" required className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-500" />
        </div>
        <div>
          <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400" htmlFor="confirmPassword">
            Confirm password
          </label>
          <input id="confirmPassword" name="confirmPassword" type="password" required className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-500" />
        </div>
      </div>

      <div>
        <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400" htmlFor="verificationCode">
          Verification code
        </label>
        <p className="mt-2 text-xs text-slate-500">Enter <span className="font-semibold text-sky-300">{challengeCode}</span> to confirm this signup is real.</p>
        <input id="verificationCode" name="verificationCode" type="text" inputMode="numeric" required className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-500" />
      </div>

      {referralCode ? (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          You’re joining through partner link <span className="font-semibold text-emerald-50">{referralCode}</span>. No code entry needed.
        </div>
      ) : null}

      {state.error ? <p className="text-sm text-rose-400">{state.error}</p> : null}
      <SubmitButton />

      <p className="text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link href="/login" className="font-medium !text-sky-400 underline-offset-4 transition hover:!text-sky-300 hover:underline">
          Log in
        </Link>
      </p>
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
      {pending ? 'Creating account…' : 'Create account'}
    </button>
  )
}
