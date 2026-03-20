export const WORKSPACE_TRIAL_DAYS = 7

export function getTrialState({ createdAt, subscriptionStatus }: { createdAt?: string | null; subscriptionStatus?: string | null }) {
  const status = subscriptionStatus ?? 'trialing'
  const created = createdAt ? new Date(createdAt) : new Date()
  const endsAt = new Date(created)
  endsAt.setUTCDate(endsAt.getUTCDate() + WORKSPACE_TRIAL_DAYS)

  const now = new Date()
  const msLeft = endsAt.getTime() - now.getTime()
  const daysLeft = Math.max(0, Math.ceil(msLeft / 86400000))
  const isTrialLike = status === 'trialing' || status === 'demo'
  const expired = isTrialLike && msLeft <= 0
  const activeTrial = isTrialLike && msLeft > 0

  return {
    activeTrial,
    expired,
    daysLeft,
    endsAt: endsAt.toISOString(),
  }
}
