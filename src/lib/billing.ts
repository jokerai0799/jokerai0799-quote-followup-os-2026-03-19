export const WORKSPACE_MONTHLY_PRICE_GBP = 29

export function formatMonthlyPriceGbp(price: number) {
  return `£${price}/month`
}

export const BILLING_MODEL_COPY = {
  title: 'Workspace billing',
  summary: 'The workspace owner pays one monthly fee. Teammates can join the workspace without paying individually.',
  signup: 'Signing up stays free. Payment should only be required when someone is using their own workspace beyond demo/trial.',
  teammate: 'If someone signs up only to join another workspace, they should not be forced to pay.',
}
