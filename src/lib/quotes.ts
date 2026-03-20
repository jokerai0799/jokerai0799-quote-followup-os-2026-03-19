import { randomUUID } from 'node:crypto'
import { supabase } from './supabase'
import { ensureWorkspaceForUser, getWorkspaceContextForUser, isWorkspaceModelAvailable } from './workspaces'

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
  workspace_id?: string | null
  client_name: string
  contact_name: string | null
  email: string | null
  company: string | null
  title: string
  value: number | string
  status: QuoteStatus
  sent_date: string | null
  notes: string | null
  template_key: TemplateKey
  follow_up_offsets: number[] | string
  created_at: string
  updated_at: string
}

function normalizeOffsets(value: QuoteRow['follow_up_offsets']): number[] {
  if (Array.isArray(value)) return value.map(Number)
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.map(Number) : [2, 5, 9]
  } catch {
    return [2, 5, 9]
  }
}

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
    followUpOffsets: normalizeOffsets(row.follow_up_offsets),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

async function getWorkspaceIdForUser(userId: string) {
  if (!(await isWorkspaceModelAvailable())) {
    return null
  }

  const existing = await getWorkspaceContextForUser(userId)
  if (existing?.workspaceId) {
    return existing.workspaceId
  }

  const created = await ensureWorkspaceForUser({ userId, seedStarter: false })
  return created?.workspaceId ?? null
}

export async function getQuotes(userId?: string): Promise<Quote[]> {
  const select = 'id, workspace_id, client_name, contact_name, email, company, title, value, status, sent_date, notes, template_key, follow_up_offsets, created_at, updated_at'

  if (userId) {
    const workspaceId = await getWorkspaceIdForUser(userId)
    if (workspaceId) {
      const { data, error } = await supabase
        .from('quotes')
        .select(select)
        .eq('workspace_id', workspaceId)
        .order('updated_at', { ascending: false })

      if (error) {
        throw new Error(`Failed to fetch workspace quotes: ${error.message}`)
      }

      return (data as QuoteRow[]).map(mapRow)
    }
  }

  const { data, error } = await supabase.from('quotes').select(select).order('updated_at', { ascending: false })
  if (error) {
    throw new Error(`Failed to fetch quotes: ${error.message}`)
  }

  return (data as QuoteRow[]).map(mapRow)
}

export async function getQuote(id: string, userId?: string): Promise<Quote | undefined> {
  const select = 'id, workspace_id, client_name, contact_name, email, company, title, value, status, sent_date, notes, template_key, follow_up_offsets, created_at, updated_at'

  if (userId) {
    const workspaceId = await getWorkspaceIdForUser(userId)
    if (workspaceId) {
      const { data, error } = await supabase
        .from('quotes')
        .select(select)
        .eq('id', id)
        .eq('workspace_id', workspaceId)
        .maybeSingle()

      if (error) {
        throw new Error(`Failed to fetch workspace quote: ${error.message}`)
      }

      return data ? mapRow(data as QuoteRow) : undefined
    }
  }

  const { data, error } = await supabase.from('quotes').select(select).eq('id', id).maybeSingle()
  if (error) {
    throw new Error(`Failed to fetch quote: ${error.message}`)
  }

  return data ? mapRow(data as QuoteRow) : undefined
}

export async function saveQuote(input: QuoteInput, id?: string, userId?: string) {
  const payload = {
    id: id ?? randomUUID(),
    client_name: input.clientName,
    contact_name: input.contactName || null,
    email: input.email || null,
    company: input.company || null,
    title: input.title,
    value: input.value,
    status: input.status,
    sent_date: input.sentDate || null,
    notes: input.notes || null,
    template_key: input.templateKey,
    follow_up_offsets: input.followUpOffsets,
  }

  if (userId) {
    const workspaceId = await getWorkspaceIdForUser(userId)
    if (workspaceId) {
      const scopedPayload = { ...payload, workspace_id: workspaceId }
      const { error } = id
        ? await supabase.from('quotes').update(scopedPayload).eq('id', id).eq('workspace_id', workspaceId)
        : await supabase.from('quotes').insert(scopedPayload)

      if (error) {
        throw new Error(`Failed to save workspace quote: ${error.message}`)
      }
      return
    }
  }

  const { error } = id ? await supabase.from('quotes').update(payload).eq('id', id) : await supabase.from('quotes').insert(payload)
  if (error) {
    throw new Error(`Failed to save quote: ${error.message}`)
  }
}

export async function setQuoteStatus(id: string, status: QuoteStatus, userId?: string) {
  if (userId) {
    const workspaceId = await getWorkspaceIdForUser(userId)
    if (workspaceId) {
      const { error } = await supabase
        .from('quotes')
        .update({ status })
        .eq('id', id)
        .eq('workspace_id', workspaceId)

      if (error) {
        throw new Error(`Failed to update workspace quote status: ${error.message}`)
      }
      return
    }
  }

  const { error } = await supabase.from('quotes').update({ status }).eq('id', id)
  if (error) {
    throw new Error(`Failed to update quote status: ${error.message}`)
  }
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
  const wonQuotes = quotes.filter((quote) => quote.status === 'won')
  const lostQuotes = quotes.filter((quote) => quote.status === 'lost')
  const closedQuotes = [...wonQuotes, ...lostQuotes]
  const valueAtRisk = chaseable.reduce((sum, quote) => sum + quote.value, 0)
  const wonRevenue = wonQuotes.reduce((sum, quote) => sum + quote.value, 0)

  return {
    totalQuotes: quotes.length,
    valueAtRisk,
    wonRevenue,
    overdueCount: overdueFollowUps.length,
    wonCount: wonQuotes.length,
    lostCount: lostQuotes.length,
    winRate: closedQuotes.length ? Math.round((wonQuotes.length / closedQuotes.length) * 100) : 0,
  }
}

export function getStatusBreakdown(quotes: Quote[]) {
  return STATUSES.map((status) => {
    const matching = quotes.filter((quote) => quote.status === status)
    return {
      status,
      count: matching.length,
      value: matching.reduce((sum, quote) => sum + quote.value, 0),
    }
  })
}

export function getDailyChaseList(quotes: Quote[]) {
  return quotes
    .map((quote) => ({ quote, chase: getChaseState(quote) }))
    .filter(({ chase }) => chase.overdue || chase.dueToday)
    .sort((a, b) => (a.chase.nextDate ?? '').localeCompare(b.chase.nextDate ?? ''))
}

export function getMessageTitle(title: string) {
  const cleaned = title
    .replace(/\s+(quote|estimate|proposal)$/i, '')
    .replace(/\s+/g, ' ')
    .trim()

  return cleaned || title.trim()
}

export function renderTemplate(quote: Quote) {
  return messageTemplates[quote.templateKey]
    .replaceAll('{{contactName}}', quote.contactName || quote.clientName)
    .replaceAll('{{title}}', getMessageTitle(quote.title))
}
