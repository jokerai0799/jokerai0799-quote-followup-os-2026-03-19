'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { saveQuote, STATUSES, TEMPLATE_KEYS, type QuoteStatus, type TemplateKey } from '@/lib/quotes'

function readOffsets(raw: FormDataEntryValue | null) {
  return String(raw ?? '2,5,9')
    .split(',')
    .map((value) => Number.parseInt(value.trim(), 10))
    .filter((value) => Number.isFinite(value) && value > 0)
}

function normalizeStatus(raw: FormDataEntryValue | null): QuoteStatus {
  const value = String(raw ?? 'draft') as QuoteStatus
  return STATUSES.includes(value) ? value : 'draft'
}

function normalizeTemplate(raw: FormDataEntryValue | null): TemplateKey {
  const value = String(raw ?? 'friendly') as TemplateKey
  return TEMPLATE_KEYS.includes(value) ? value : 'friendly'
}

function validate(formData: FormData) {
  const clientName = String(formData.get('clientName') ?? '').trim()
  const contactName = String(formData.get('contactName') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const company = String(formData.get('company') ?? '').trim()
  const title = String(formData.get('title') ?? '').trim()
  const value = Number(formData.get('value') ?? 0)
  const status = normalizeStatus(formData.get('status'))
  const sentDate = String(formData.get('sentDate') ?? '').trim()
  const notes = String(formData.get('notes') ?? '').trim()
  const templateKey = normalizeTemplate(formData.get('templateKey'))
  const followUpOffsets = readOffsets(formData.get('followUpOffsets'))

  if (!clientName || !title || !Number.isFinite(value) || value < 0) {
    throw new Error('Client name, quote title, and a valid value are required.')
  }

  return {
    clientName,
    contactName,
    email,
    company,
    title,
    value,
    status,
    sentDate,
    notes,
    templateKey,
    followUpOffsets: followUpOffsets.length ? followUpOffsets : [2, 5, 9],
  }
}

export async function createQuote(formData: FormData) {
  const payload = validate(formData)
  await saveQuote(payload)
  revalidatePath('/')
  revalidatePath('/quotes')
  revalidatePath('/chase-list')
  redirect('/quotes')
}

export async function updateQuote(id: string, formData: FormData) {
  const payload = validate(formData)
  await saveQuote(payload, id)
  revalidatePath('/')
  revalidatePath('/quotes')
  revalidatePath('/chase-list')
  revalidatePath(`/quotes/${id}/edit`)
  redirect('/quotes')
}
