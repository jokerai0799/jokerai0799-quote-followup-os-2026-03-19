'use client'

import Link from 'next/link'
import { useFormState, useFormStatus } from 'react-dom'
import { useSyncExternalStore } from 'react'
import { WORKSPACE_CURRENCY_OPTIONS, type WorkspaceCurrency } from '@/lib/currency'
import { signupAction, type SignupState } from './actions'

const initialState: SignupState = {}

const SIGNUP_CURRENCIES: WorkspaceCurrency[] = ['GBP', 'USD', 'EUR', 'AUD', 'CAD']

function detectSignupCurrency(): WorkspaceCurrency {
  if (typeof navigator === 'undefined') return 'GBP'

  const localeList = navigator.languages?.length ? navigator.languages : [navigator.language]
  const localeText = localeList.join(' ').toUpperCase()

  if (/\b(EN-US|ES-US|US)\b/.test(localeText)) return 'USD'
  if (/\b(EN-CA|FR-CA|CA)\b/.test(localeText)) return 'CAD'
  if (/\b(EN-AU|AU)\b/.test(localeText)) return 'AUD'
  if (/\b(EN-IE|DE-|FR-|ES-|IT-|NL-|PT-|AT-|BE-|FI-|GR-|LU|IE|DE|FR|ES|IT|NL|PT|AT|BE|FI|GR|LU)\b/.test(localeText)) return 'EUR'
  return 'GBP'
}

function subscribeToLocaleChanges(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => {}
  }

  window.addEventListener('languagechange', callback)
  return () => window.removeEventListener('languagechange', callback)
}

function getSignupCurrencySnapshot() {
  const detected = detectSignupCurrency()
  return SIGNUP_CURRENCIES.includes(detected) ? detected : 'GBP'
}

export function SignupForm({ referralCode = '' }: { referralCode?: string }) {
  const [state, formAction] = useFormState(signupAction, initialState)
  const defaultCurrencyCode = useSyncExternalStore<WorkspaceCurrency>(subscribeToLocaleChanges, getSignupCurrencySnapshot, () => 'GBP')

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="referralCode" value={referralCode} />

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

      <fieldset>
        <legend className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">Workspace currency</legend>
        <div key={defaultCurrencyCode} className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {WORKSPACE_CURRENCY_OPTIONS.map((currency) => {
            const inputId = `currency-${currency.value}`

            return (
              <label
                key={currency.value}
                htmlFor={inputId}
                className="group relative flex cursor-pointer items-center justify-center rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-3 text-sm text-slate-200 transition hover:border-sky-500/70 hover:bg-slate-900/80 has-[:checked]:border-sky-500 has-[:checked]:bg-sky-500/12 has-[:checked]:text-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky-500/70"
              >
                <input
                  id={inputId}
                  type="radio"
                  name="currencyCode"
                  value={currency.value}
                  defaultChecked={currency.value === defaultCurrencyCode}
                  className="sr-only"
                />
                <span className="font-medium">{currency.label}</span>
              </label>
            )
          })}
        </div>
        <p className="mt-2 text-xs text-slate-500">This sets how quote values display in your workspace. You can change it later in settings.</p>
      </fieldset>

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
