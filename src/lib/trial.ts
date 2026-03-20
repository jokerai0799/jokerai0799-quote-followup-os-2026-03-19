export const WORKSPACE_TRIAL_DAYS = 7

export function getTrialState({
  createdAt,
  subscriptionStatus,
  currentPeriodEnd,
  cancelAtPeriodEnd,
}: {
  createdAt?: string | null
  subscriptionStatus?: string | null
  currentPeriodEnd?: string | null
  cancelAtPeriodEnd?: boolean | null
}) {
  const status = subscriptionStatus ?? 'trialing'
  const created = createdAt ? new Date(createdAt) : new Date()
  const endsAt = new Date(created)
  endsAt.setUTCDate(endsAt.getUTCDate() + WORKSPACE_TRIAL_DAYS)

  const now = new Date()
  const msLeft = endsAt.getTime() - now.getTime()
  const daysLeft = Math.max(0, Math.ceil(msLeft / 86400000))
  const isTrialLike = status === 'trialing' || status === 'demo'
  const trialExpired = isTrialLike && msLeft <= 0
  const activeTrial = isTrialLike && msLeft > 0

  const paidThrough = currentPeriodEnd ? new Date(currentPeriodEnd) : null
  const cancelScheduled = status === 'active' && Boolean(cancelAtPeriodEnd) && Boolean(paidThrough && paidThrough.getTime() > now.getTime())
  const canceled = status === 'canceled' || (Boolean(cancelAtPeriodEnd) && Boolean(paidThrough && paidThrough.getTime() <= now.getTime()))
  const activePaid = status === 'active' && !canceled

  return {
    activeTrial,
    expired: trialExpired,
    canceled,
    activePaid,
    cancelScheduled,
    daysLeft,
    endsAt: endsAt.toISOString(),
    paidThrough: paidThrough?.toISOString() ?? null,
  }
}
