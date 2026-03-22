'use client'

import { useSyncExternalStore } from 'react'
import { formatWorkspaceCurrency, type WorkspaceCurrency } from '@/lib/currency'

const BILLING_PRICE_BY_CURRENCY: Record<WorkspaceCurrency, number> = {
  GBP: 29.99,
  USD: 39.99,
  EUR: 34.99,
  AUD: 59.99,
  CAD: 54.99,
}

const BILLING_CURRENCIES: WorkspaceCurrency[] = ['GBP', 'USD', 'EUR', 'AUD', 'CAD']

function detectBillingCurrency(): WorkspaceCurrency {
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
  const detected = detectBillingCurrency()
  return BILLING_CURRENCIES.includes(detected) ? detected : 'GBP'
}

export function LocalizedBillingPrice({ className }: { className?: string }) {
  const currencyCode = useSyncExternalStore<WorkspaceCurrency>(subscribeToLocaleChanges, getClientCurrencySnapshot, () => 'GBP')
  const price = BILLING_PRICE_BY_CURRENCY[currencyCode]

  return <span className={className}>{formatWorkspaceCurrency(price, currencyCode, { maximumFractionDigits: 2 })}/month</span>
}
