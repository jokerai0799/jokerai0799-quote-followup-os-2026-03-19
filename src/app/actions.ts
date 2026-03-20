'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { auth, signOut } from '@/auth'
import { assertWorkspaceWriteAccess } from '@/lib/access'
import { saveQuote, setQuoteStatus, STATUSES, TEMPLATE_KEYS, type QuoteInput, type QuoteStatus, type TemplateKey } from '@/lib/quotes'
import { setDefaultWorkspaceForUser } from '@/lib/workspaces'

const statusEnum = z.enum([...STATUSES] as [QuoteStatus, ...QuoteStatus[]])
const templateEnum = z.enum([...TEMPLATE_KEYS] as [TemplateKey, ...TemplateKey[]])

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const followUpSchema = z.preprocess((value) => {
  const parsed = String(value ?? '')
    .split(',')
    .map((item) => Number.parseInt(item.trim(), 10))
    .filter((num) => Number.isFinite(num) && num > 0)
  return parsed.length ? parsed : undefined
}, z.array(z.number().int().positive()).min(1))

const quoteSchema = z.object({
  clientName: z.string().trim().min(1, 'Client name is required'),
  contactName: z.string().optional().transform((value) => (value ?? '').trim()),
  email: z.string().optional().transform((value) => (value ?? '').trim()).refine((value) => !value || emailRegex.test(value), 'Email must be valid'),
  company: z.string().optional().transform((value) => (value ?? '').trim()),
  title: z.string().trim().min(1, 'Quote title is required'),
  value: z.coerce.number().nonnegative({ message: 'Value must be zero or greater' }),
  status: statusEnum.default('draft'),
  sentDate: z.string().optional().transform((value) => {
    const trimmed = (value ?? '').trim()
    return trimmed ? trimmed : null
  }),
  markDueNow: z.preprocess((value) => value === 'on' || value === 'true', z.boolean()).default(false),
  notes: z.string().optional().transform((value) => (value ?? '').trim()),
  templateKey: templateEnum.default('friendly'),
  followUpOffsets: followUpSchema.default([2, 5, 9]),
})

async function requireSession() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  return session as typeof session & { user: { id: string; email?: string | null; name?: string | null } }
}

function parseQuote(formData: FormData): QuoteInput {
  const payload = Object.fromEntries(formData.entries())
  const parsed = quoteSchema.safeParse(payload)
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Invalid quote payload')
  }

  let sentDate = parsed.data.sentDate
  let status = parsed.data.status

  if (parsed.data.markDueNow && !sentDate) {
    const firstOffset = Math.max(1, Math.min(...parsed.data.followUpOffsets))
    const dueBaseDate = new Date()
    dueBaseDate.setUTCDate(dueBaseDate.getUTCDate() - firstOffset)
    sentDate = dueBaseDate.toISOString().slice(0, 10)

    if (status === 'draft') {
      status = 'sent'
    }
  }

  return {
    clientName: parsed.data.clientName,
    contactName: parsed.data.contactName ?? '',
    email: parsed.data.email ?? '',
    company: parsed.data.company ?? '',
    title: parsed.data.title,
    value: parsed.data.value,
    status,
    sentDate,
    notes: parsed.data.notes ?? '',
    templateKey: parsed.data.templateKey,
    followUpOffsets: parsed.data.followUpOffsets,
  }
}

function revalidateWorkspacePaths() {
  revalidatePath('/dashboard')
  revalidatePath('/quotes')
  revalidatePath('/chase-list')
  revalidatePath('/settings')
}

export async function createQuote(formData: FormData) {
  const session = await requireSession()
  await assertWorkspaceWriteAccess(session.user.id)
  const payload = parseQuote(formData)
  await saveQuote(payload, undefined, session.user.id)
  revalidateWorkspacePaths()
  redirect('/quotes')
}

export async function updateQuote(id: string, formData: FormData) {
  const session = await requireSession()
  await assertWorkspaceWriteAccess(session.user.id)
  const payload = parseQuote(formData)
  await saveQuote(payload, id, session.user.id)
  revalidateWorkspacePaths()
  revalidatePath(`/quotes/${id}/edit`)
  redirect('/quotes')
}

export async function updateQuoteStatusAction(id: string, status: QuoteStatus) {
  const session = await requireSession()
  await assertWorkspaceWriteAccess(session.user.id)
  await setQuoteStatus(id, status, session.user.id)
  revalidateWorkspacePaths()
  revalidatePath(`/quotes/${id}/edit`)
}

export async function setActiveWorkspaceAction(formData: FormData) {
  const session = await requireSession()
  const workspaceId = String(formData.get('workspaceId') ?? '').trim()

  if (!workspaceId) {
    throw new Error('Workspace not found')
  }

  await setDefaultWorkspaceForUser(session.user.id, workspaceId)
  revalidateWorkspacePaths()
  redirect('/dashboard')
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' })
}
