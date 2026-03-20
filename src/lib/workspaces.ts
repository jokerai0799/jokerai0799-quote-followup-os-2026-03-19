import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { supabase } from './supabase'
import { STATUSES, TEMPLATE_KEYS, type QuoteInput, type QuoteStatus, type TemplateKey } from './quotes'

type WorkspaceRow = {
  id: string
  name: string
  slug: string
  is_template: boolean
  created_at: string
}

type MembershipRow = {
  workspace_id: string
  user_id: string
  role: string
  created_at: string
}

export type WorkspaceMember = {
  userId: string
  name: string
  email: string
  role: string
  joinedAt: string
}

type SubscriptionRow = {
  workspace_id: string
  status: string
  plan_name: string | null
  monthly_price_gbp: number
}

type SeedQuote = Partial<QuoteInput> & {
  id: string
  createdAt?: string
  updatedAt?: string
}

export type WorkspaceContext = {
  workspaceId: string
  workspaceName: string
  slug: string
  isTemplate: boolean
  role: string
  subscriptionStatus: string
  planName: string | null
  monthlyPriceGbp: number
  createdAt: string
}

export function getWorkspaceDisplayName(workspace: WorkspaceContext | null, user?: { name?: string | null; email?: string | null } | null) {
  const fallbackName = user?.name?.trim() ? `${user.name.trim()} Workspace` : user?.email?.trim() ? `${user.email.split('@')[0]} Workspace` : 'Your Workspace'

  if (!workspace) {
    return fallbackName
  }

  const looksLikeLegacyDefault = workspace.isTemplate || /^(demo|jokerai?|your|new) workspace$/i.test(workspace.workspaceName)
  if (looksLikeLegacyDefault) {
    return fallbackName
  }

  return workspace.workspaceName
}

let workspaceModelAvailableCache: boolean | null = null
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function normalizeId(id?: string) {
  return id && uuidPattern.test(id) ? id : randomUUID()
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'workspace'
}

function buildWorkspaceName(name?: string | null, email?: string | null) {
  const trimmedName = name?.trim()
  if (trimmedName && !/^jokerai?$/i.test(trimmedName)) {
    return `${trimmedName} Workspace`
  }
  if (email?.trim()) {
    return `${email.split('@')[0]} Workspace`
  }
  return 'Owner Workspace'
}

async function readSeedQuotes() {
  const seedFile = path.join(process.cwd(), 'data', 'quotes.json')
  if (!fs.existsSync(seedFile)) {
    return [] as SeedQuote[]
  }

  const raw = fs.readFileSync(seedFile, 'utf8')
  return JSON.parse(raw) as SeedQuote[]
}

export async function isWorkspaceModelAvailable() {
  if (workspaceModelAvailableCache !== null) {
    return workspaceModelAvailableCache
  }

  const { error } = await supabase.from('workspaces').select('id').limit(1)
  workspaceModelAvailableCache = !error
  return workspaceModelAvailableCache
}

export async function getWorkspaceContextForUser(userId: string): Promise<WorkspaceContext | null> {
  if (!(await isWorkspaceModelAvailable())) {
    return null
  }

  const { data: membership, error: membershipError } = await supabase
    .from('workspace_memberships')
    .select('workspace_id, user_id, role, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle<MembershipRow>()

  if (membershipError) {
    throw new Error(`Failed to fetch workspace membership: ${membershipError.message}`)
  }

  if (!membership) {
    return null
  }

  const [{ data: workspace, error: workspaceError }, { data: subscription, error: subscriptionError }] = await Promise.all([
    supabase.from('workspaces').select('id, name, slug, is_template, created_at').eq('id', membership.workspace_id).single<WorkspaceRow>(),
    supabase.from('subscriptions').select('workspace_id, status, plan_name, monthly_price_gbp').eq('workspace_id', membership.workspace_id).maybeSingle<SubscriptionRow>(),
  ])

  if (workspaceError) {
    throw new Error(`Failed to fetch workspace: ${workspaceError.message}`)
  }

  if (subscriptionError && subscriptionError.code !== 'PGRST116') {
    throw new Error(`Failed to fetch subscription: ${subscriptionError.message}`)
  }

  return {
    workspaceId: workspace.id,
    workspaceName: workspace.name,
    slug: workspace.slug,
    isTemplate: workspace.is_template,
    role: membership.role,
    subscriptionStatus: subscription?.status ?? 'demo',
    planName: subscription?.plan_name ?? null,
    monthlyPriceGbp: subscription?.monthly_price_gbp ?? 29.99,
    createdAt: workspace.created_at,
  }
}

export async function getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
  const { data: memberships, error: membershipError } = await supabase
    .from('workspace_memberships')
    .select('workspace_id, user_id, role, created_at')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: true })

  if (membershipError) {
    throw new Error(`Failed to fetch workspace members: ${membershipError.message}`)
  }

  if (!memberships?.length) {
    return []
  }

  const userIds = memberships.map((membership) => membership.user_id)
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, name, email')
    .in('id', userIds)

  if (usersError) {
    throw new Error(`Failed to fetch workspace users: ${usersError.message}`)
  }

  const userMap = new Map((users ?? []).map((user) => [user.id, user]))

  return memberships.flatMap((membership) => {
    const user = userMap.get(membership.user_id)
    if (!user) return []

    return [{
      userId: membership.user_id,
      name: user.name,
      email: user.email,
      role: membership.role,
      joinedAt: membership.created_at,
    }]
  })
}

export async function seedStarterQuotesForWorkspace(workspaceId: string) {
  const { count, error: countError } = await supabase
    .from('quotes')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)

  if (countError) {
    throw new Error(`Failed to inspect workspace quotes: ${countError.message}`)
  }

  if ((count ?? 0) > 0) {
    return
  }

  const records = await readSeedQuotes()
  if (!records.length) {
    return
  }

  const now = new Date().toISOString()
  const payload = records.map((record) => {
    const status = STATUSES.includes((record.status ?? 'draft') as QuoteStatus)
      ? ((record.status ?? 'draft') as QuoteStatus)
      : 'draft'
    const templateKey = TEMPLATE_KEYS.includes((record.templateKey ?? 'friendly') as TemplateKey)
      ? ((record.templateKey ?? 'friendly') as TemplateKey)
      : 'friendly'

    return {
      id: normalizeId(record.id),
      workspace_id: workspaceId,
      client_name: record.clientName ?? 'Unknown client',
      contact_name: record.contactName ?? null,
      email: record.email ?? null,
      company: record.company ?? null,
      title: record.title ?? 'Untitled quote',
      value: Number(record.value) || 0,
      status,
      sent_date: record.sentDate || null,
      notes: record.notes ?? null,
      template_key: templateKey,
      follow_up_offsets: record.followUpOffsets ?? [2, 5, 9],
      created_at: record.createdAt ?? now,
      updated_at: record.updatedAt ?? now,
    }
  })

  const { error } = await supabase.from('quotes').insert(payload)
  if (error) {
    throw new Error(`Failed to seed starter workspace quotes: ${error.message}`)
  }
}

export async function renameWorkspace(workspaceId: string, name: string) {
  const trimmed = name.trim()
  const { error } = await supabase.from('workspaces').update({ name: trimmed }).eq('id', workspaceId)

  if (error) {
    throw new Error(`Failed to rename workspace: ${error.message}`)
  }
}

export async function addWorkspaceMember(workspaceId: string, userId: string, role: 'admin' | 'member') {
  const { error } = await supabase
    .from('workspace_memberships')
    .insert({ workspace_id: workspaceId, user_id: userId, role })

  if (error) {
    throw new Error(`Failed to add workspace member: ${error.message}`)
  }
}

export async function ensureWorkspaceForUser({
  userId,
  name,
  email,
  workspaceName,
  seedStarter = false,
}: {
  userId: string
  name?: string | null
  email?: string | null
  workspaceName?: string
  seedStarter?: boolean
}) {
  const existing = await getWorkspaceContextForUser(userId)
  if (existing) {
    if (seedStarter) {
      await seedStarterQuotesForWorkspace(existing.workspaceId)
    }
    return existing
  }

  if (!(await isWorkspaceModelAvailable())) {
    return null
  }

  const finalWorkspaceName = workspaceName?.trim() || buildWorkspaceName(name, email)
  const slugBase = slugify(finalWorkspaceName)
  const slug = `${slugBase}-${randomUUID().slice(0, 8)}`

  const { data: workspace, error: workspaceError } = await supabase
    .from('workspaces')
    .insert({
      id: randomUUID(),
      name: finalWorkspaceName,
      slug,
      is_template: false,
      owner_user_id: userId,
    })
    .select('id, name, slug, is_template, created_at')
    .single<WorkspaceRow>()

  if (workspaceError) {
    throw new Error(`Failed to create workspace: ${workspaceError.message}`)
  }

  const membershipError = (await supabase.from('workspace_memberships').insert({
    workspace_id: workspace.id,
    user_id: userId,
    role: 'owner',
  })).error

  if (membershipError) {
    throw new Error(`Failed to create workspace membership: ${membershipError.message}`)
  }

  const subscriptionError = (await supabase.from('subscriptions').upsert({
    workspace_id: workspace.id,
    status: 'trialing',
    plan_name: '7-day trial',
    monthly_price_gbp: 29.99,
  }, { onConflict: 'workspace_id' })).error

  if (subscriptionError) {
    throw new Error(`Failed to create workspace subscription: ${subscriptionError.message}`)
  }

  await supabase.from('users').update({ default_workspace_id: workspace.id }).eq('id', userId)

  if (seedStarter) {
    await seedStarterQuotesForWorkspace(workspace.id)
  }

  return {
    workspaceId: workspace.id,
    workspaceName: workspace.name,
    slug: workspace.slug,
    isTemplate: workspace.is_template,
    role: 'owner',
    subscriptionStatus: 'trialing',
    planName: '7-day trial',
    monthlyPriceGbp: 29.99,
    createdAt: workspace.created_at,
  } satisfies WorkspaceContext
}
