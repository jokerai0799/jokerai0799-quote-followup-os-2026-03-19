export const WORKSPACE_MONTHLY_PRICE_GBP = 29.99
export const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/5kQdRb8cu2vb22X4vb8Ra01'

export function formatMonthlyPriceGbp(price: number) {
  return `£${price.toFixed(2)}/month`
}

export const BILLING_MODEL_COPY = {
  title: 'Workspace billing',
  summary: 'One subscription covers this workspace and everyone in it.',
  signup: 'Signing up is free. Your workspace starts with a 7-day trial before payment is needed.',
  teammate: 'People joining someone else’s workspace do not need their own subscription.',
  expiredOwner: 'Your trial has ended — upgrade to keep using this workspace.',
  expiredMember: 'This workspace trial has ended. Ask the workspace owner to upgrade to continue.',
  canceledOwner: 'This subscription has been canceled. Start a new subscription to keep using this workspace.',
  canceledMember: 'This subscription has been canceled. Ask the workspace owner to restart billing to continue.',
  cta: 'Start subscription',
  cancelCta: 'Cancel subscription',
}
