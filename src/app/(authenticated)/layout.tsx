import type { ReactNode } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { signOutAction } from '@/app/actions'
import { BrandLogo } from '@/components/brand-logo'
import { Nav } from '@/components/nav'
import { BILLING_MODEL_COPY, STRIPE_CHECKOUT_URL, WORKSPACE_MONTHLY_PRICE_GBP, formatMonthlyPriceGbp } from '@/lib/billing'
import { getDailyChaseList, getQuotes } from '@/lib/quotes'
import { getTrialState } from '@/lib/trial'
import { findUserById } from '@/lib/users'
import { ensureWorkspaceForUser, getWorkspaceDisplayName } from '@/lib/workspaces'

export default async function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  const user = await findUserById(session.user.id)
  const workspace = user
    ? await ensureWorkspaceForUser({ userId: user.id, name: user.name, email: user.email })
    : null
  const displayWorkspaceName = getWorkspaceDisplayName(workspace, user)
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
            <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:gap-8">
              <BrandLogo href="/dashboard" showTagline={false} />
              <div className="min-w-0">
                <Nav chaseCount={dueCount} chaseSignature={chaseSignature} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 xl:flex-nowrap xl:justify-end">
              <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-100 lg:inline-flex">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
                {dueCount} due today
              </div>

              <Link
                href="/settings"
                className="hidden max-w-[180px] items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/90 transition hover:border-white/20 hover:bg-white/10 hover:text-white lg:inline-flex"
              >
                <span className="truncate">{displayWorkspaceName}</span>
              </Link>

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
          {trial.activeTrial ? (
            <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950 shadow-sm">
              <span className="font-medium">{trial.daysLeft} day{trial.daysLeft === 1 ? '' : 's'} left in your workspace trial.</span>{' '}
              {workspace?.role === 'owner'
                ? `You’ll move to ${formatMonthlyPriceGbp(WORKSPACE_MONTHLY_PRICE_GBP)} to keep using this workspace after the trial.`
                : 'The workspace owner will be able to upgrade before the trial ends.'}
            </div>
          ) : null}

          {trial.cancelScheduled ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 shadow-sm">
              <span className="font-medium">Subscription ends at period end.</span>{' '}
              Access stays active until {trial.paidThrough ? new Date(trial.paidThrough).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'the current billing period ends'}.
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
                  <Link href={STRIPE_CHECKOUT_URL} className="inline-flex rounded-xl border border-rose-700 bg-rose-600 px-4 py-2.5 text-sm font-medium !text-white text-white transition hover:bg-rose-500" target="_blank" rel="noreferrer">
                    {BILLING_MODEL_COPY.cta}
                  </Link>
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
