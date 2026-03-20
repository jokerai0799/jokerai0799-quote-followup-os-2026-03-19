'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/auth'
import { assertWorkspaceWriteAccess } from '@/lib/access'
import { findUserByEmail, updateUserName } from '@/lib/users'
import { addWorkspaceMember, cancelWorkspaceSubscription, getWorkspaceContextForUser, getWorkspaceMembers, removeWorkspaceMember, renameWorkspace } from '@/lib/workspaces'

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

  const workspace = await getWorkspaceContextForUser(userId)
  if (!workspace) {
    throw new Error('Workspace not found')
  }

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

  const workspace = await getWorkspaceContextForUser(userId)
  if (!workspace) {
    return { error: 'Workspace not found' }
  }

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

export async function cancelSubscriptionAction() {
  const userId = await requireUserId()
  const workspace = await requireOwnerWorkspace(userId)

  if (workspace.subscriptionStatus !== 'active') {
    throw new Error('No active subscription to cancel')
  }

  await cancelWorkspaceSubscription(workspace.workspaceId, workspace.currentPeriodEnd)
  revalidatePath('/settings')
  revalidatePath('/dashboard')
  revalidatePath('/quotes')
  revalidatePath('/chase-list')
}
