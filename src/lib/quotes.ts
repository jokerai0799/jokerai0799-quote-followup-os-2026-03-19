import { promises as fs } from 'node:fs'
import path from 'node:path'

export const STATUSES = ['draft', 'sent', 'follow-up due', 'replied', 'won', 'lost'] as const
export const TEMPLATE_KEYS = ['friendly', 'nudge', 'checkin'] as const

export type QuoteStatus = (typeof STATUSES)[number]
export type TemplateKey = (typeof TEMPLATE_KEYS)[number]

export type Quote = {
  id: string
  clientName: string
  contactName: string
  email: string
  company: string
  title: string
  value: number
  status: QuoteStatus
  sentDate: string
  notes: string
  templateKey: TemplateKey
  followUpOffsets: number[]
  createdAt: string
  updatedAt: string
}

export type QuoteInput = {
  clientName: string
  contactName: string
  email: string
  company: string
  title: string
  value: number
  status: QuoteStatus
  sentDate: string
  notes: string
  templateKey: TemplateKey
  followUpOffsets: number[]
}

const dataFile = path.join(process.cwd(), 'data', 'quotes.json')

export const messageTemplates: Record<TemplateKey, string> = {
  friendly:
    'Hi {{contactName}}, just checking you received the quote for {{title}}. Happy to answer questions or talk through next steps.',
  nudge:
    'Hi {{contactName}}, following up on the {{title}} quote I sent over. If this is still live, I can hold time this week to walk through it with you.',
  checkin:
    'Hi {{contactName}}, wanted to see where things stand on {{title}}. If priorities have shifted, no problem — I can update timings or scope if helpful.',
}

export async function getQuotes(): Promise<Quote[]> {
  const raw = await fs.readFile(dataFile, 'utf8')
  const quotes = JSON.parse(raw) as Quote[]
  return quotes.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function getQuote(id: string): Promise<Quote | undefined> {
  const quotes = await getQuotes()
  return quotes.find((quote) => quote.id === id)
}

export async function saveQuote(input: QuoteInput, id?: string) {
  const quotes = await getQuotes()
  const now = new Date().toISOString()

  if (id) {
    const index = quotes.findIndex((quote) => quote.id === id)
    if (index === -1) throw new Error('Quote not found')

    quotes[index] = {
      ...quotes[index],
      ...input,
      updatedAt: now,
    }
  } else {
    quotes.push({
      id: `q-${Math.random().toString(36).slice(2, 8)}`,
      ...input,
      createdAt: now,
      updatedAt: now,
    })
  }

  await fs.writeFile(dataFile, JSON.stringify(quotes, null, 2) + '\n', 'utf8')
}

export function buildFollowUpSchedule(sentDate: string, offsets: number[]) {
  if (!sentDate) return []

  return offsets.map((offset, index) => {
    const date = new Date(`${sentDate}T00:00:00Z`)
    date.setUTCDate(date.getUTCDate() + offset)

    return {
      step: index + 1,
      offset,
      dueDate: date.toISOString().slice(0, 10),
    }
  })
}

export function getNextFollowUpDate(quote: Quote) {
  const today = new Date().toISOString().slice(0, 10)
  const schedule = buildFollowUpSchedule(quote.sentDate, quote.followUpOffsets)
  return schedule.find((item) => item.dueDate >= today)?.dueDate ?? schedule.at(-1)?.dueDate ?? null
}

export function getChaseState(quote: Quote) {
  if (!quote.sentDate || ['draft', 'won', 'lost'].includes(quote.status)) {
    return { nextDate: null, overdue: false, dueToday: false }
  }

  const nextDate = getNextFollowUpDate(quote)
  if (!nextDate) {
    return { nextDate: null, overdue: false, dueToday: false }
  }

  const today = new Date().toISOString().slice(0, 10)
  return {
    nextDate,
    overdue: nextDate < today,
    dueToday: nextDate === today,
  }
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(date: string) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00Z`))
}

export function getMetrics(quotes: Quote[]) {
  const chaseable = quotes.filter((quote) => !['won', 'lost'].includes(quote.status))
  const overdueFollowUps = quotes.filter((quote) => getChaseState(quote).overdue)
  const valueAtRisk = chaseable.reduce((sum, quote) => sum + quote.value, 0)
  const wonRevenue = quotes.filter((quote) => quote.status === 'won').reduce((sum, quote) => sum + quote.value, 0)

  return {
    totalQuotes: quotes.length,
    valueAtRisk,
    wonRevenue,
    overdueCount: overdueFollowUps.length,
  }
}

export function getDailyChaseList(quotes: Quote[]) {
  return quotes
    .map((quote) => ({ quote, chase: getChaseState(quote) }))
    .filter(({ chase }) => chase.overdue || chase.dueToday)
    .sort((a, b) => (a.chase.nextDate ?? '').localeCompare(b.chase.nextDate ?? ''))
}

export function renderTemplate(quote: Quote) {
  return messageTemplates[quote.templateKey]
    .replaceAll('{{contactName}}', quote.contactName || quote.clientName)
    .replaceAll('{{title}}', quote.title)
}
