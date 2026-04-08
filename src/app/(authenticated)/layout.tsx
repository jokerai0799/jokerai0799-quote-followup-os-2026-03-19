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
      <header className="sticky top-0 z-30 border-b border-slate-800/90 bg-[#162033]/92 text-white shadow-[0_1px_0_rgba(255,255,255,0.04),0_4px_24px_rgba(0,0,0,0.35)] backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex items-center justify-between gap-3 xl:hidden">
            <BrandLogo href="/" compact className="min-w-0" />

            <div className="flex shrink-0 items-center gap-2">
              <Link
                href="/quotes/new"
                className="inline-flex items-center justify-center rounded-lg border border-sky-500 bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:border-sky-400 hover:bg-sky-500"
              >
                New quote
              </Link>

              <details className="relative">
                <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl border border-white/10 bg-white/5 text-base text-white/85 transition hover:border-white/20 hover:bg-white/10 hover:text-white">
                  ☰
                </summary>
                <div className="absolute right-0 z-20 mt-2 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 text-slate-900 shadow-[0_18px_50px_rgba(15,23,42,0.22)]">
                  <div className="px-2 py-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Workspace</p>
                    <p className="mt-1 text-xs text-slate-500">Switch workspace or sign out.</p>
                  </div>
                  <div className="space-y-2">
                    <WorkspaceSwitcher workspaces={workspaceOptions} activeWorkspaceId={workspace?.workspaceId} user={user ? { id: user.id, name: user.name, email: user.email } : null} variant="light" />
                    <form action={signOutAction}>
                      <button
                        type="submit"
                        className="flex w-full items-center justify-center rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                      >
                        Sign out
                      </button>
                    </form>
                  </div>
                </div>
              </details>
            </div>
          </div>

          <div className="mt-3 xl:hidden">
            <Nav chaseCount={dueCount} chaseSignature={chaseSignature} />
          </div>

          <div className="hidden xl:flex xl:items-center xl:justify-between xl:gap-4">
            <div className="flex min-w-0 items-center gap-8">
              <BrandLogo href="/" />
              <div className="min-w-0">
                <Nav chaseCount={dueCount} chaseSignature={chaseSignature} />
              </div>
            </div>

            <div className="flex items-center gap-2.5 xl:flex-nowrap xl:justify-end">
              <WorkspaceSwitcher workspaces={workspaceOptions} activeWorkspaceId={workspace?.workspaceId} user={user ? { id: user.id, name: user.name, email: user.email } : null} />

              <Link
                href="/quotes/new"
                className="inline-flex items-center justify-center rounded-lg border border-sky-500 bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:border-sky-400 hover:bg-sky-500"
              >
                New quote
              </Link>

              <form action={signOutAction}>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-white/75 transition hover:bg-white/5 hover:text-white"
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
                  <span className="font-medium">Trial ends in {trial.daysLeft} day{trial.daysLeft === 1 ? '' : 's'}.</span>{' '}
                  {workspace?.role === 'owner'
                    ? 'Upgrade to keep your workspace running.'
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
