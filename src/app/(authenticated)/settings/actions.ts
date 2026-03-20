'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { auth } from '@/auth'
import { assertWorkspaceWriteAccess } from '@/lib/access'
import { WORKSPACE_MONTHLY_PRICE_GBP } from '@/lib/billing'
import { getStripeClient, STRIPE_PRICE_ID, toWorkspaceSubscriptionStatus } from '@/lib/stripe'
import { findUserByEmail, findUserById, updateUserName } from '@/lib/users'
import { addWorkspaceMember, cancelWorkspaceSubscription, getWorkspaceContextForUser, getWorkspaceMembers, removeWorkspaceMember, renameWorkspace, syncWorkspaceSubscription } from '@/lib/workspaces'

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name'),
})

const workspaceSchema = z.object({
  workspaceName: z.string().trim().min(2, 'Enter a workspace name'),
})

const teammateSchema = z.object({
  email: z.string().trim().email('Enter a valid teammate email'),
  role: z.enum(['admin', 'member']),
})

export type AddTeammateState = {
  error?: string
  success?: string
}

export type RemoveMemberState = {
  error?: string
  success?: string
}

async function requireOwnerWorkspace(userId: string) {
  const workspace = await getWorkspaceContextForUser(userId)
  if (!workspace) {
    throw new Error('Workspace not found')
  }
  if (workspace.role !== 'owner') {
    throw new Error('Only the workspace owner can manage members')
  }
  return workspace
}

async function requireUserId() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  return session.user.id
}

export async function updateProfileAction(formData: FormData) {
  const userId = await requireUserId()
  await assertWorkspaceWriteAccess(userId)

  const parsed = profileSchema.safeParse({ name: formData.get('name') })
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Invalid profile payload')
  }

  await updateUserName(userId, parsed.data.name)
  revalidatePath('/settings')
  revalidatePath('/dashboard')
}

export async function updateWorkspaceAction(formData: FormData) {
  const userId = await requireUserId()
  await assertWorkspaceWriteAccess(userId)

  const parsed = workspaceSchema.safeParse({ workspaceName: formData.get('workspaceName') })
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Invalid workspace payload')
  }

  const workspace = await requireOwnerWorkspace(userId)
  await renameWorkspace(workspace.workspaceId, parsed.data.workspaceName)
  revalidatePath('/settings')
  revalidatePath('/dashboard')
}

export async function addTeammateAction(_prevState: AddTeammateState, formData: FormData): Promise<AddTeammateState> {
  const userId = await requireUserId()
  await assertWorkspaceWriteAccess(userId)

  const parsed = teammateSchema.safeParse({
    email: formData.get('email'),
    role: formData.get('role'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid teammate details' }
  }

  const workspace = await requireOwnerWorkspace(userId)

  const teammate = await findUserByEmail(parsed.data.email)
  if (!teammate) {
    return { error: 'That email does not have an account yet. Ask them to sign up first, then add them here.' }
  }

  const members = await getWorkspaceMembers(workspace.workspaceId)
  if (members.some((member) => member.userId === teammate.id)) {
    return { error: 'That person is already in this workspace.' }
  }

  await addWorkspaceMember(workspace.workspaceId, teammate.id, parsed.data.role)
  revalidatePath('/settings')

  return { success: `${teammate.email} added to workspace as ${parsed.data.role}.` }
}

export async function removeTeammateAction(_prevState: RemoveMemberState, formData: FormData): Promise<RemoveMemberState> {
  const userId = await requireUserId()
  await assertWorkspaceWriteAccess(userId)
  const workspace = await requireOwnerWorkspace(userId)

  const memberUserId = String(formData.get('memberUserId') ?? '').trim()
  if (!memberUserId) {
    return { error: 'Member not found' }
  }

  if (memberUserId === userId) {
    return { error: 'You cannot remove the workspace owner.' }
  }

  const members = await getWorkspaceMembers(workspace.workspaceId)
  const target = members.find((member) => member.userId === memberUserId)
  if (!target) {
    return { error: 'Member not found' }
  }

  if (target.role === 'owner') {
    return { error: 'You cannot remove the workspace owner.' }
  }

  await removeWorkspaceMember(workspace.workspaceId, memberUserId)
  revalidatePath('/settings')

  return { success: `${target.email} removed from workspace.` }
}

export async function startSubscriptionCheckoutAction() {
  const userId = await requireUserId()
  const workspace = await requireOwnerWorkspace(userId)
  const user = await findUserById(userId)

  if (!user?.email) {
    throw new Error('Workspace owner email not found')
  }

  const stripe = getStripeClient()
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    success_url: 'https://quotefollowup.online/settings?billing=success',
    cancel_url: 'https://quotefollowup.online/settings?billing=cancel',
    line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
    allow_promotion_codes: true,
    customer_email: user.email,
    subscription_data: {
      metadata: {
        workspaceId: workspace.workspaceId,
        ownerUserId: userId,
      },
    },
    metadata: {
      workspaceId: workspace.workspaceId,
      ownerUserId: userId,
    },
  })

  if (!session.url) {
    throw new Error('Stripe checkout session did not return a URL')
  }

  redirect(session.url)
}

export async function cancelSubscriptionAction() {
  const userId = await requireUserId()
  const workspace = await requireOwnerWorkspace(userId)

  if (workspace.subscriptionStatus !== 'active') {
    throw new Error('No active subscription to cancel')
  }

  const currentSubscription = await cancelWorkspaceSubscription(workspace.workspaceId)
  if (!currentSubscription?.provider_subscription_id) {
    throw new Error('This workspace does not have a linked Stripe subscription yet')
  }

  const stripe = getStripeClient()
  const subscription = await stripe.subscriptions.update(currentSubscription.provider_subscription_id, {
    cancel_at_period_end: true,
  })

  await syncWorkspaceSubscription(workspace.workspaceId, {
    status: toWorkspaceSubscriptionStatus(subscription.status),
    planName: subscription.status === 'trialing' ? '7-day trial' : 'Active plan',
    monthlyPriceGbp: WORKSPACE_MONTHLY_PRICE_GBP,
    provider: 'stripe',
    providerCustomerId: typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id ?? null,
    providerSubscriptionId: subscription.id,
    currentPeriodEnd: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000).toISOString() : workspace.currentPeriodEnd,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
  })

  revalidatePath('/settings')
  revalidatePath('/dashboard')
  revalidatePath('/quotes')
  revalidatePath('/chase-list')
}
