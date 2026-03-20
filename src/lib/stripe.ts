import Stripe from 'stripe'

export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || 'price_1TCt9sRuuPfhc5ohti3XqS9f'

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY')
  }

  return new Stripe(secretKey, {
    apiVersion: '2025-08-27.basil',
  })
}

export function getStripeWebhookSecret() {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    throw new Error('Missing STRIPE_WEBHOOK_SECRET')
  }

  return webhookSecret
}

export function toWorkspaceSubscriptionStatus(status: Stripe.Subscription.Status): 'trialing' | 'active' | 'past_due' | 'canceled' {
  switch (status) {
    case 'trialing':
      return 'trialing'
    case 'active':
      return 'active'
    case 'past_due':
    case 'unpaid':
    case 'paused':
      return 'past_due'
    case 'canceled':
    case 'incomplete_expired':
      return 'canceled'
    case 'incomplete':
      return 'trialing'
    default:
      return 'active'
  }
}
