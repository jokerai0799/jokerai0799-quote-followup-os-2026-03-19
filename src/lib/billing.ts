export const WORKSPACE_MONTHLY_PRICE_GBP = 29.99

export function formatMonthlyPriceGbp(price: number) {
  return `£${price.toFixed(2)}/month`
}

export const BILLING_MODEL_COPY = {
  title: 'Workspace billing',
  summary: 'One subscription covers the active workspace and everyone who works inside it.',
  signup: 'You can subscribe when you are ready. If you click Subscribe now, billing starts immediately for this workspace.',
  teammate: 'Invited teammates can switch into this workspace and use it under this workspace subscription. They do not need their own separate paid plan to work here.',
  expiredOwner: 'Your trial has ended — upgrade to keep using this workspace.',
  expiredMember: 'This workspace trial has ended. Ask the workspace owner to upgrade to continue.',
  canceledOwner: 'This subscription has been canceled. Start a new subscription to keep using this workspace.',
  canceledMember: 'This subscription has been canceled. Ask the workspace owner to restart billing to continue.',
  cta: 'Start subscription',
  cancelCta: 'Cancel subscription',
}
