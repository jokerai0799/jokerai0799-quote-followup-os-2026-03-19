export const WORKSPACE_CURRENCIES = ['GBP', 'USD', 'EUR', 'AUD', 'CAD'] as const

export type WorkspaceCurrency = (typeof WORKSPACE_CURRENCIES)[number]

export const WORKSPACE_CURRENCY_OPTIONS: Array<{ value: WorkspaceCurrency; label: string }> = [
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'AUD', label: 'AUD (A$)' },
  { value: 'CAD', label: 'CAD (C$)' },
]

const CURRENCY_LOCALES: Record<WorkspaceCurrency, string> = {
  GBP: 'en-GB',
  USD: 'en-US',
  EUR: 'de-DE',
  AUD: 'en-AU',
  CAD: 'en-CA',
}

export function normalizeWorkspaceCurrency(value?: string | null): WorkspaceCurrency {
  return WORKSPACE_CURRENCIES.includes((value ?? '').toUpperCase() as WorkspaceCurrency)
    ? ((value ?? '').toUpperCase() as WorkspaceCurrency)
    : 'GBP'
}

export function formatWorkspaceCurrency(value: number, currency: WorkspaceCurrency = 'GBP', options?: { maximumFractionDigits?: number }) {
  return new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
    style: 'currency',
    currency,
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
  }).format(value)
}
