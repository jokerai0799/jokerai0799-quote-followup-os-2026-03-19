export const WORKSPACE_MONTHLY_PRICE_GBP = 29

export function formatMonthlyPriceGbp(price: number) {
  return `£${price}/month`
}

export const BILLING_MODEL_COPY = {
  title: 'Workspace billing',
  summary: 'The workspace owner pays one monthly fee. Teammates can join the workspace without paying individually.',
  signup: 'Signing up stays free. New workspaces should start on a 7-day trial before upgrading.',
  teammate: 'If someone signs up only to join another workspace, they should not be forced to pay.',
  expiredOwner: 'Your trial has ended — upgrade to keep using this workspace.',
  expiredMember: 'This workspace trial has ended. Ask the workspace owner to upgrade to continue.',
}
