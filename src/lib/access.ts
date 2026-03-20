import { redirect } from 'next/navigation'
import { getTrialState } from '@/lib/trial'
import { getWorkspaceContextForUser } from '@/lib/workspaces'

export async function getWorkspaceAccessState(userId: string) {
  const workspace = await getWorkspaceContextForUser(userId)
  const trial = getTrialState({
    createdAt: workspace?.createdAt,
    subscriptionStatus: workspace?.subscriptionStatus,
    currentPeriodEnd: workspace?.currentPeriodEnd,
    cancelAtPeriodEnd: workspace?.cancelAtPeriodEnd,
  })
  const locked = (trial.expired && workspace?.subscriptionStatus !== 'active') || trial.canceled

  return {
    workspace,
    trial,
    expired: locked,
  }
}

export async function requireWorkspaceUsageAccess(userId: string) {
  const access = await getWorkspaceAccessState(userId)
  if (access.expired) {
    redirect('/settings?billing=upgrade')
  }
  return access
}

export async function assertWorkspaceWriteAccess(userId: string) {
  const access = await getWorkspaceAccessState(userId)
  if (access.expired) {
    throw new Error('TRIAL_EXPIRED')
  }
  return access
}
