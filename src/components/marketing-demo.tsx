'use client'

import { useSyncExternalStore } from 'react'
import { formatWorkspaceCurrency, type WorkspaceCurrency } from '@/lib/currency'

type DemoRow = {
  client: string
  title: string
  value: number
  status: 'Sent' | 'Follow-up due' | 'Won'
  next: string
}

const demoRows: DemoRow[] = [
  { client: 'Jones Property Lets', title: 'Boiler replacement quote', value: 2400, status: 'Sent', next: '20 Mar' },
  { client: 'Reed Electrical', title: 'Consumer unit upgrade', value: 980, status: 'Follow-up due', next: 'Today' },
  { client: 'Walker Homes', title: 'Kitchen repaint and touch-ups', value: 1450, status: 'Won', next: 'None' },
]

const DEMO_CURRENCIES: WorkspaceCurrency[] = ['GBP', 'USD', 'EUR', 'AUD', 'CAD']

function detectDemoCurrency(): WorkspaceCurrency {
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

function getClientCurrencySnapshot() {
  const detected = detectDemoCurrency()
  return DEMO_CURRENCIES.includes(detected) ? detected : 'GBP'
}

function formatDemoCurrency(value: number, currency: WorkspaceCurrency) {
  return formatWorkspaceCurrency(value, currency, { maximumFractionDigits: 0 })
}

export function MarketingDemo() {
  const currencyCode = useSyncExternalStore<WorkspaceCurrency>(subscribeToLocaleChanges, getClientCurrencySnapshot, () => 'GBP')

  const openPipeline = demoRows.filter((row) => row.status !== 'Won').reduce((sum, row) => sum + row.value, 0)
  const wonRevenue = demoRows.filter((row) => row.status === 'Won').reduce((sum, row) => sum + row.value, 0)

  return (
    <div className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
      <div className="border-b border-sky-100 bg-gradient-to-r from-sky-600 via-blue-500 to-cyan-400 px-5 py-4 text-white sm:px-8 sm:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-sky-100/90">Workspace preview</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">How the product looks in daily use</h3>
          </div>
          <p className="max-w-xl text-sm text-sky-50/90">
            A clean quote pipeline, readable status colours, and a chase list that is easy to scan at a glance.
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-8">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 sm:px-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Open pipeline</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{formatDemoCurrency(openPipeline, currencyCode)}</p>
            <p className="mt-2 text-sm text-slate-500">Quotes still in play</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 sm:px-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Due today</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">2</p>
            <p className="mt-2 text-sm text-slate-500">Quotes needing action now</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 sm:px-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Won revenue</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{formatDemoCurrency(wonRevenue, currencyCode)}</p>
            <p className="mt-2 text-sm text-slate-500">Closed business so far</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          <div className="space-y-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Pipeline</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">Quote pipeline view</h3>
            </div>
            <div className="space-y-3 md:hidden">
              {demoRows.map((row) => (
                <article key={row.client} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-medium text-slate-950">{row.client}</p>
                      <p className="mt-1 text-sm text-slate-600">{row.title}</p>
                    </div>
                    <span
                      className={
                        row.status === 'Sent'
                          ? 'inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700'
                          : row.status === 'Follow-up due'
                            ? 'inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800'
                            : 'inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700'
                      }
                    >
                      {row.status}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-3 rounded-2xl bg-slate-50 p-3 text-sm min-[360px]:grid-cols-2">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Value</p>
                      <p className="mt-1 font-medium text-slate-950">{formatDemoCurrency(row.value, currencyCode)}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Next follow-up</p>
                      <p className="mt-1 font-medium text-slate-950">{row.next}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="hidden overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm md:block">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Client</th>
                    <th className="px-4 py-3 font-medium">Quote</th>
                    <th className="px-4 py-3 font-medium">Value</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Next follow-up</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {demoRows.map((row) => (
                    <tr key={row.client}>
                      <td className="px-4 py-4 font-medium text-slate-950">{row.client}</td>
                      <td className="px-4 py-4 text-slate-700">{row.title}</td>
                      <td className="px-4 py-4 font-medium text-slate-900">{formatDemoCurrency(row.value, currencyCode)}</td>
                      <td className="px-4 py-4">
                        <span
                          className={
                            row.status === 'Sent'
                              ? 'inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700'
                              : row.status === 'Follow-up due'
                                ? 'inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800'
                                : 'inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700'
                          }
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-700">{row.next}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Today’s chase list</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">Clean and easy to scan</h3>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-medium text-slate-950">Reed Electrical</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">Consumer unit upgrade · {formatDemoCurrency(980, currencyCode)}</p>
              <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Due today. Send a quick nudge to keep the job moving.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-medium text-slate-950">Jones Property Lets</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">Boiler replacement quote · {formatDemoCurrency(2400, currencyCode)}</p>
              <p className="mt-4 rounded-2xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
                Follow-up due tomorrow. Check they received the quote and answer any questions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
