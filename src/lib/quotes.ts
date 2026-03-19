import { randomUUID } from 'node:crypto'
import { getDb } from './db'

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
  sentDate: string | null
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
  sentDate: string | null
  notes: string
  templateKey: TemplateKey
  followUpOffsets: number[]
}

export const messageTemplates: Record<TemplateKey, string> = {
  friendly:
    'Hi {{contactName}}, just checking you received the quote for {{title}}. Happy to answer questions or talk through next steps.',
  nudge:
    'Hi {{contactName}}, following up on the {{title}} quote I sent over. If this is still live, I can hold time this week to walk through it with you.',
  checkin:
    'Hi {{contactName}}, wanted to see where things stand on {{title}}. If priorities have shifted, no problem — I can update timings or scope if helpful.',
}

type QuoteRow = {
  id: string
  client_name: string
  contact_name: string | null
  email: string | null
  company: string | null
  title: string
  value: number
  status: QuoteStatus
  sent_date: string | null
  notes: string | null
  template_key: TemplateKey
  follow_up_offsets: string
  created_at: string
  updated_at: string
}

const baseSelect = `
  SELECT id, client_name, contact_name, email, company, title, value, status,
         sent_date, notes, template_key, follow_up_offsets, created_at, updated_at
  FROM quotes`

function mapRow(row: QuoteRow): Quote {
  return {
    id: row.id,
    clientName: row.client_name,
    contactName: row.contact_name ?? '',
    email: row.email ?? '',
    company: row.company ?? '',
    title: row.title,
    value: Number(row.value),
    status: row.status,
    sentDate: row.sent_date ?? null,
    notes: row.notes ?? '',
    templateKey: row.template_key,
    followUpOffsets: JSON.parse(row.follow_up_offsets) as number[],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getQuotes(): Promise<Quote[]> {
  const db = getDb()
  const rows = db.prepare(`${baseSelect} ORDER BY updated_at DESC`).all() as QuoteRow[]
  return rows.map(mapRow)
}

export async function getQuote(id: string): Promise<Quote | undefined> {
  const db = getDb()
  const row = db.prepare(`${baseSelect} WHERE id = ?`).get(id) as QuoteRow | undefined
  if (!row) return undefined
  return mapRow(row)
}

export async function saveQuote(input: QuoteInput, id?: string) {
  const db = getDb()
  const now = new Date().toISOString()
  const payload = {
    ...input,
    sentDate: input.sentDate || null,
    followUpOffsets: JSON.stringify(input.followUpOffsets),
  }

  if (id) {
    const existing = db.prepare('SELECT id FROM quotes WHERE id = ?').get(id) as { id: string } | undefined
    if (!existing) {
      throw new Error('Quote not found')
    }

    db.prepare(
      `UPDATE quotes SET
        client_name = ?,
        contact_name = ?,
        email = ?,
        company = ?,
        title = ?,
        value = ?,
        status = ?,
        sent_date = ?,
        notes = ?,
        template_key = ?,
        follow_up_offsets = ?,
        updated_at = ?
      WHERE id = ?`
    ).run(
      payload.clientName,
      payload.contactName,
      payload.email,
      payload.company,
      payload.title,
      payload.value,
      payload.status,
      payload.sentDate,
      payload.notes,
      payload.templateKey,
      payload.followUpOffsets,
      now,
      id
    )
    return
  }

  const newId = randomUUID()
  db.prepare(
    `INSERT INTO quotes (
      id,
      client_name,
      contact_name,
      email,
      company,
      title,
      value,
      status,
      sent_date,
      notes,
      template_key,
      follow_up_offsets,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    newId,
    payload.clientName,
    payload.contactName,
    payload.email,
    payload.company,
    payload.title,
    payload.value,
    payload.status,
    payload.sentDate,
    payload.notes,
    payload.templateKey,
    payload.followUpOffsets,
    now,
    now
  )
}

export function buildFollowUpSchedule(sentDate: string | null, offsets: number[]) {
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
  if (!quote.sentDate) return null
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

export function formatDate(date: string | null | undefined) {
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
