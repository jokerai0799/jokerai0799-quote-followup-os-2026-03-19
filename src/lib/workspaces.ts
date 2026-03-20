import { randomUUID } from 'node:crypto'
import { WORKSPACE_MONTHLY_PRICE_GBP } from './billing'
import { supabase } from './supabase'

type WorkspaceRow = {
  id: string
  name: string
  slug: string
  is_template: boolean
  owner_user_id?: string | null
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
  current_period_end: string | null
  cancel_at_period_end: boolean | null
  canceled_at: string | null
}

export type WorkspaceContext = {
  workspaceId: string
  workspaceName: string
  slug: string
  isTemplate: boolean
  ownerUserId?: string | null
  role: string
  subscriptionStatus: string
  planName: string | null
  monthlyPriceGbp: number
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
  canceledAt: string | null
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

  const [{ data: userRow, error: userError }, { data: memberships, error: membershipError }] = await Promise.all([
    supabase.from('users').select('default_workspace_id').eq('id', userId).maybeSingle<{ default_workspace_id?: string | null }>(),
    supabase
      .from('workspace_memberships')
      .select('workspace_id, user_id, role, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .returns<MembershipRow[]>(),
  ])

  if (userError) {
    throw new Error(`Failed to fetch user workspace state: ${userError.message}`)
  }

  if (membershipError) {
    throw new Error(`Failed to fetch workspace memberships: ${membershipError.message}`)
  }

  const membershipList = memberships ?? []
  const membership = userRow?.default_workspace_id
    ? membershipList.find((entry) => entry.workspace_id === userRow.default_workspace_id) ?? membershipList[0]
    : membershipList[0]

  if (!membership) {
    return null
  }

  const [{ data: workspace, error: workspaceError }, { data: subscription, error: subscriptionError }] = await Promise.all([
    supabase.from('workspaces').select('id, name, slug, is_template, owner_user_id, created_at').eq('id', membership.workspace_id).single<WorkspaceRow>(),
    supabase.from('subscriptions').select('workspace_id, status, plan_name, monthly_price_gbp, current_period_end, cancel_at_period_end, canceled_at').eq('workspace_id', membership.workspace_id).maybeSingle<SubscriptionRow>(),
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
    ownerUserId: workspace.owner_user_id ?? null,
    role: membership.role,
    subscriptionStatus: subscription?.status ?? 'trialing',
    planName: subscription?.plan_name ?? null,
    monthlyPriceGbp: subscription?.monthly_price_gbp ?? 29.99,
    currentPeriodEnd: subscription?.current_period_end ?? null,
    cancelAtPeriodEnd: subscription?.cancel_at_period_end ?? false,
    canceledAt: subscription?.canceled_at ?? null,
    createdAt: workspace.created_at,
  }
}

export async function listWorkspaceContextsForUser(userId: string): Promise<WorkspaceContext[]> {
  if (!(await isWorkspaceModelAvailable())) {
    return []
  }

  const { data: memberships, error: membershipError } = await supabase
    .from('workspace_memberships')
    .select('workspace_id, user_id, role, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .returns<MembershipRow[]>()

  if (membershipError) {
    throw new Error(`Failed to fetch workspace memberships: ${membershipError.message}`)
  }

  const membershipList = memberships ?? []
  if (!membershipList.length) {
    return []
  }

  const workspaceIds = membershipList.map((entry) => entry.workspace_id)
  const [{ data: workspaces, error: workspaceError }, { data: subscriptions, error: subscriptionError }] = await Promise.all([
    supabase.from('workspaces').select('id, name, slug, is_template, owner_user_id, created_at').in('id', workspaceIds).returns<WorkspaceRow[]>(),
    supabase.from('subscriptions').select('workspace_id, status, plan_name, monthly_price_gbp, current_period_end, cancel_at_period_end, canceled_at').in('workspace_id', workspaceIds).returns<SubscriptionRow[]>(),
  ])

  if (workspaceError) {
    throw new Error(`Failed to fetch workspaces: ${workspaceError.message}`)
  }

  if (subscriptionError) {
    throw new Error(`Failed to fetch subscriptions: ${subscriptionError.message}`)
  }

  const workspaceMap = new Map((workspaces ?? []).map((workspace) => [workspace.id, workspace]))
  const subscriptionMap = new Map((subscriptions ?? []).map((subscription) => [subscription.workspace_id, subscription]))

  return membershipList.flatMap((membership) => {
    const workspace = workspaceMap.get(membership.workspace_id)
    if (!workspace) return []
    const subscription = subscriptionMap.get(membership.workspace_id)

    return [{
      workspaceId: workspace.id,
      workspaceName: workspace.name,
      slug: workspace.slug,
      isTemplate: workspace.is_template,
      ownerUserId: workspace.owner_user_id ?? null,
      role: membership.role,
      subscriptionStatus: subscription?.status ?? 'trialing',
      planName: subscription?.plan_name ?? null,
      monthlyPriceGbp: subscription?.monthly_price_gbp ?? 29.99,
      currentPeriodEnd: subscription?.current_period_end ?? null,
      cancelAtPeriodEnd: subscription?.cancel_at_period_end ?? false,
      canceledAt: subscription?.canceled_at ?? null,
      createdAt: workspace.created_at,
    }]
  })
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

export async function renameWorkspace(workspaceId: string, name: string) {
  const trimmed = name.trim()
  const { error } = await supabase.from('workspaces').update({ name: trimmed }).eq('id', workspaceId)

  if (error) {
    throw new Error(`Failed to rename workspace: ${error.message}`)
  }
}

export async function cancelWorkspaceSubscription(workspaceId: string, currentPeriodEnd?: string | null) {
  const now = new Date()
  const fallbackPeriodEnd = new Date(now)
  fallbackPeriodEnd.setUTCMonth(fallbackPeriodEnd.getUTCMonth() + 1)

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'active',
      plan_name: 'Active plan',
      monthly_price_gbp: WORKSPACE_MONTHLY_PRICE_GBP,
      cancel_at_period_end: true,
      canceled_at: now.toISOString(),
      current_period_end: currentPeriodEnd ?? fallbackPeriodEnd.toISOString(),
    })
    .eq('workspace_id', workspaceId)

  if (error) {
    throw new Error(`Failed to cancel workspace subscription: ${error.message}`)
  }
}

export async function addWorkspaceMember(workspaceId: string, userId: string, role: 'admin' | 'member') {
  const { error } = await supabase
    .from('workspace_memberships')
    .insert({ workspace_id: workspaceId, user_id: userId, role })

  if (error) {
    throw new Error(`Failed to add workspace member: ${error.message}`)
  }

  const { data: userRow, error: userError } = await supabase
    .from('users')
    .select('default_workspace_id')
    .eq('id', userId)
    .maybeSingle<{ default_workspace_id?: string | null }>()

  if (userError) {
    throw new Error(`Failed to inspect teammate default workspace: ${userError.message}`)
  }

  if (!userRow?.default_workspace_id) {
    const { error: updateError } = await supabase
      .from('users')
      .update({ default_workspace_id: workspaceId })
      .eq('id', userId)

    if (updateError) {
      throw new Error(`Failed to set teammate default workspace: ${updateError.message}`)
    }
  }
}

export async function removeWorkspaceMember(workspaceId: string, userId: string) {
  const { error } = await supabase
    .from('workspace_memberships')
    .delete()
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)

  if (error) {
    throw new Error(`Failed to remove workspace member: ${error.message}`)
  }

  const [{ data: userRow, error: userError }, { data: ownedWorkspace, error: ownedWorkspaceError }] = await Promise.all([
    supabase.from('users').select('default_workspace_id').eq('id', userId).maybeSingle<{ default_workspace_id?: string | null }>(),
    supabase.from('workspaces').select('id').eq('owner_user_id', userId).order('created_at', { ascending: true }).limit(1).maybeSingle<{ id: string }>(),
  ])

  if (userError) {
    throw new Error(`Failed to inspect removed teammate workspace state: ${userError.message}`)
  }

  if (ownedWorkspaceError) {
    throw new Error(`Failed to inspect removed teammate owned workspace: ${ownedWorkspaceError.message}`)
  }

  if (userRow?.default_workspace_id === workspaceId) {
    const { error: updateError } = await supabase
      .from('users')
      .update({ default_workspace_id: ownedWorkspace?.id ?? null })
      .eq('id', userId)

    if (updateError) {
      throw new Error(`Failed to reset removed teammate default workspace: ${updateError.message}`)
    }
  }
}

export async function setDefaultWorkspaceForUser(userId: string, workspaceId: string) {
  const { data: membership, error: membershipError } = await supabase
    .from('workspace_memberships')
    .select('workspace_id')
    .eq('user_id', userId)
    .eq('workspace_id', workspaceId)
    .maybeSingle<{ workspace_id: string }>()

  if (membershipError) {
    throw new Error(`Failed to verify workspace membership: ${membershipError.message}`)
  }

  if (!membership) {
    throw new Error('Workspace access not found')
  }

  const { error: updateError } = await supabase
    .from('users')
    .update({ default_workspace_id: workspaceId })
    .eq('id', userId)

  if (updateError) {
    throw new Error(`Failed to update active workspace: ${updateError.message}`)
  }
}

export async function ensureWorkspaceForUser({
  userId,
  name,
  email,
  workspaceName,
}: {
  userId: string
  name?: string | null
  email?: string | null
  workspaceName?: string
}) {
  const existing = await getWorkspaceContextForUser(userId)
  if (existing) {
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
    monthly_price_gbp: 0,
    current_period_end: null,
    cancel_at_period_end: false,
    canceled_at: null,
  }, { onConflict: 'workspace_id' })).error

  if (subscriptionError) {
    throw new Error(`Failed to create workspace subscription: ${subscriptionError.message}`)
  }

  await supabase.from('users').update({ default_workspace_id: workspace.id }).eq('id', userId)

  return {
    workspaceId: workspace.id,
    workspaceName: workspace.name,
    slug: workspace.slug,
    isTemplate: workspace.is_template,
    ownerUserId: userId,
    role: 'owner',
    subscriptionStatus: 'trialing',
    planName: '7-day trial',
    monthlyPriceGbp: 29.99,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    canceledAt: null,
    createdAt: workspace.created_at,
  } satisfies WorkspaceContext
}
