'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/auth'
import { updateUserName } from '@/lib/users'
import { getWorkspaceContextForUser, renameWorkspace } from '@/lib/workspaces'

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name'),
})

const workspaceSchema = z.object({
  workspaceName: z.string().trim().min(2, 'Enter a workspace name'),
})

async function requireUserId() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  return session.user.id
}

export async function updateProfileAction(formData: FormData) {
  const userId = await requireUserId()
  const parsed = profileSchema.safeParse({
    name: formData.get('name'),
  })

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Invalid profile payload')
  }

  await updateUserName(userId, parsed.data.name)
  revalidatePath('/settings')
  revalidatePath('/dashboard')
}

export async function updateWorkspaceAction(formData: FormData) {
  const userId = await requireUserId()
  const parsed = workspaceSchema.safeParse({
    workspaceName: formData.get('workspaceName'),
  })

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
