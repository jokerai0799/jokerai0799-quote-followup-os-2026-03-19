import type { ReactNode } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { signOutAction } from '@/app/actions'
import { startSubscriptionCheckoutAction } from '@/app/(authenticated)/settings/actions'
import { BrandLogo } from '@/components/brand-logo'
import { ChaseNotificationStrip } from '@/components/chase-notification-strip'
import { Nav } from '@/components/nav'
import { WorkspaceSwitcher } from '@/components/workspace-switcher'
import { BILLING_MODEL_COPY, WORKSPACE_MONTHLY_PRICE_GBP, formatMonthlyPriceGbp } from '@/lib/billing'
import { getDailyChaseList, getQuotes } from '@/lib/quotes'
import { getTrialState } from '@/lib/trial'
import { findUserById } from '@/lib/users'
import { getWorkspaceContextForUser, listWorkspaceContextsForUser } from '@/lib/workspaces'

export default async function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  const user = await findUserById(session.user.id)
  const workspace = await getWorkspaceContextForUser(session.user.id)
  const workspaceOptions = user ? await listWorkspaceContextsForUser(user.id) : []
  const trial = getTrialState({
    createdAt: workspace?.createdAt,
    subscriptionStatus: workspace?.subscriptionStatus,
    currentPeriodEnd: workspace?.currentPeriodEnd,
    cancelAtPeriodEnd: workspace?.cancelAtPeriodEnd,
  })
  const quotes = await getQuotes(session.user.id)
  const dueQuotes = getDailyChaseList(quotes).map(({ quote }) => quote)
  const dueCount = dueQuotes.length
  const chaseSignature = dueQuotes.map((quote) => `${quote.id}:${quote.updatedAt}`).join('|') || 'empty'

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-800 bg-[#162033] text-white shadow-[0_1px_0_rgba(255,255,255,0.04),0_4px_24px_rgba(0,0,0,0.35)]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-center xl:gap-8">
              <BrandLogo href="/" />
              <div className="min-w-0">
                <Nav chaseCount={dueCount} chaseSignature={chaseSignature} />
              </div>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center xl:flex-nowrap xl:justify-end">
              <WorkspaceSwitcher workspaces={workspaceOptions} activeWorkspaceId={workspace?.workspaceId} user={user ? { id: user.id, name: user.name, email: user.email } : null} />

              <Link
                href="/quotes/new"
                className="inline-flex w-full items-center justify-center rounded-lg border border-sky-500 bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:border-sky-400 hover:bg-sky-500 sm:w-auto"
              >
                New quote
              </Link>

              <form action={signOutAction}>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-white/75 transition hover:bg-white/5 hover:text-white sm:w-auto"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <ChaseNotificationStrip chaseCount={dueCount} chaseSignature={chaseSignature} />

          {trial.activeTrial ? (
            <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="font-medium">{trial.daysLeft} day{trial.daysLeft === 1 ? '' : 's'} left in this workspace trial.</span>{' '}
                  {workspace?.role === 'owner'
                    ? `Upgrade to ${formatMonthlyPriceGbp(WORKSPACE_MONTHLY_PRICE_GBP)} to keep using this workspace after the trial. Stripe billing is currently in GBP.`
                    : 'The workspace owner can upgrade before the trial ends. Your personal workspace billing does not affect access while you are working inside this workspace.'}
                </div>
                {workspace?.role === 'owner' ? (
                  <form action={startSubscriptionCheckoutAction}>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-xl border border-emerald-600 bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-emerald-500 hover:bg-emerald-500"
                    >
                      Subscribe now
                    </button>
                  </form>
                ) : null}
              </div>
            </div>
          ) : null}

          {trial.expired || trial.canceled ? (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="font-medium">
                    {trial.canceled
                      ? (workspace?.role === 'owner' ? BILLING_MODEL_COPY.canceledOwner : BILLING_MODEL_COPY.canceledMember)
                      : (workspace?.role === 'owner' ? BILLING_MODEL_COPY.expiredOwner : BILLING_MODEL_COPY.expiredMember)}
                  </span>{' '}
                  Current launch price: {formatMonthlyPriceGbp(WORKSPACE_MONTHLY_PRICE_GBP)} per workspace.
                </div>
                {workspace?.role === 'owner' ? (
                  <form action={startSubscriptionCheckoutAction}>
                    <button type="submit" className="inline-flex rounded-xl border border-rose-700 bg-rose-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-500">
                      {BILLING_MODEL_COPY.cta}
                    </button>
                  </form>
                ) : null}
              </div>
            </div>
          ) : null}

          {children}
        </div>
      </div>
    </main>
  )
}
