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
    ? await ensureWorkspaceForUser({ userId: user.id, name: user.name, email: user.email, seedStarter: false })
    : null
  const displayWorkspaceName = getWorkspaceDisplayName(workspace, user)
  const trial = getTrialState({ createdAt: workspace?.createdAt, subscriptionStatus: workspace?.subscriptionStatus })
  const quotes = await getQuotes(session.user.id)
  const dueQuotes = getDailyChaseList(quotes).map(({ quote }) => quote)
  const dueCount = dueQuotes.length
  const chaseSignature = dueQuotes.map((quote) => `${quote.id}:${quote.updatedAt}`).join('|') || 'empty'

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-800 bg-[#162033] text-white shadow-[0_1px_0_rgba(255,255,255,0.04),0_4px_24px_rgba(0,0,0,0.35)]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
              <BrandLogo href="/dashboard" showTagline={false} />
              <Nav chaseCount={dueCount} chaseSignature={chaseSignature} />
            </div>

            <div className="flex flex-wrap items-center gap-3 xl:justify-end">
              <div className="hidden rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white lg:inline-flex lg:items-center lg:gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
                {dueCount} due today
              </div>

              <Link href="/settings" className="hidden rounded-lg border border-slate-500 bg-slate-900/55 px-3 py-2 text-sm font-medium text-white transition hover:border-slate-300 hover:bg-slate-900 lg:inline-flex">
                {displayWorkspaceName}
              </Link>

              <Link href="/quotes/new" className="inline-flex items-center justify-center rounded-lg border border-sky-500 bg-sky-600 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white transition hover:border-sky-400 hover:bg-sky-500">
                New quote
              </Link>

              <form action={signOutAction}>
                <button type="submit" className="inline-flex items-center justify-center rounded-lg border border-slate-500 bg-transparent px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white transition hover:border-slate-300 hover:bg-white/5">
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

          {trial.expired ? (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="font-medium">{workspace?.role === 'owner' ? BILLING_MODEL_COPY.expiredOwner : BILLING_MODEL_COPY.expiredMember}</span>{' '}
                  Current launch price: {formatMonthlyPriceGbp(WORKSPACE_MONTHLY_PRICE_GBP)} per workspace.
                </div>
                {workspace?.role === 'owner' ? (
                  <Link href={STRIPE_CHECKOUT_URL} className="inline-flex rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800" target="_blank" rel="noreferrer">
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
