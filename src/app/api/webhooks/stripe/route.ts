import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { WORKSPACE_MONTHLY_PRICE_GBP } from '@/lib/billing'
import { getStripeClient, getStripeWebhookSecret, toWorkspaceSubscriptionStatus } from '@/lib/stripe'
import { findUserByEmail } from '@/lib/users'
import { getWorkspaceContextForUser, syncWorkspaceSubscription } from '@/lib/workspaces'

export const runtime = 'nodejs'

function subscriptionPeriodEnd(subscription: Stripe.Subscription) {
  const raw = subscription.items.data[0]?.current_period_end ?? null
  return raw ? new Date(raw * 1000).toISOString() : null
}

async function resolveWorkspaceIdFromSession(session: Stripe.Checkout.Session) {
  const workspaceId = session.metadata?.workspaceId
  if (workspaceId) return workspaceId

  const email = session.customer_details?.email ?? session.customer_email ?? null
  if (!email) return null

  const user = await findUserByEmail(email)
  if (!user) return null
  const workspace = await getWorkspaceContextForUser(user.id)
  return workspace?.workspaceId ?? null
}

async function syncFromStripeSubscription(workspaceId: string, subscription: Stripe.Subscription) {
  await syncWorkspaceSubscription(workspaceId, {
    status: toWorkspaceSubscriptionStatus(subscription.status),
    planName: subscription.status === 'trialing' ? '7-day trial' : 'Active plan',
    monthlyPriceGbp: WORKSPACE_MONTHLY_PRICE_GBP,
    provider: 'stripe',
    providerCustomerId: typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id ?? null,
    providerSubscriptionId: subscription.id,
    currentPeriodEnd: subscriptionPeriodEnd(subscription),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
  })
}

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 })
  }

  const body = await request.text()
  const stripe = getStripeClient()
  const webhookSecret = getStripeWebhookSecret()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid webhook signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode !== 'subscription') {
        break
      }

      const workspaceId = await resolveWorkspaceIdFromSession(session)
      const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id
      if (!workspaceId || !subscriptionId) {
        break
      }

      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      await syncFromStripeSubscription(workspaceId, subscription)
      break
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const workspaceId = subscription.metadata?.workspaceId
      if (!workspaceId) {
        break
      }
      await syncFromStripeSubscription(workspaceId, subscription)
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}
