import Link from 'next/link'
import { auth } from '@/auth'
import { AddTeammateForm } from './add-teammate-form'
import { RemoveMemberButton } from './remove-member-button'
import { cancelSubscriptionAction, updateProfileAction, updateWorkspaceAction } from './actions'
import { BILLING_MODEL_COPY, STRIPE_CHECKOUT_URL, WORKSPACE_MONTHLY_PRICE_GBP, formatMonthlyPriceGbp } from '@/lib/billing'
import { getDailyChaseList, getMetrics, getQuotes } from '@/lib/quotes'
import { getTrialState } from '@/lib/trial'
import { findUserById } from '@/lib/users'
import { ensureWorkspaceForUser, getWorkspaceMembers } from '@/lib/workspaces'

type PageProps = {
  searchParams: Promise<{ billing?: string }>
}

export default async function SettingsPage({ searchParams }: PageProps) {
  const session = await auth()
  if (!session?.user?.id) {
    return null
  }

  const { billing } = await searchParams
  const [user, workspace, quotes] = await Promise.all([
    findUserById(session.user.id),
    ensureWorkspaceForUser({ userId: session.user.id, seedStarter: false }),
    getQuotes(session.user.id),
  ])

  const members = workspace ? await getWorkspaceMembers(workspace.workspaceId) : []
  const trial = getTrialState({
    createdAt: workspace?.createdAt,
    subscriptionStatus: workspace?.subscriptionStatus,
    currentPeriodEnd: workspace?.currentPeriodEnd,
    cancelAtPeriodEnd: workspace?.cancelAtPeriodEnd,
  })
  const metrics = getMetrics(quotes)
  const dueToday = getDailyChaseList(quotes).length
  const showUpgradeHighlight = billing === 'upgrade' || trial.expired || trial.canceled
  const canManageMembers = workspace?.role === 'owner' && !trial.expired && !trial.canceled
  const showLockedState = trial.expired || trial.canceled
  const paidThroughLabel = trial.paidThrough
    ? new Date(trial.paidThrough).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Settings</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-950">Workspace and account</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Update your workspace details, manage team access, and review billing and next steps.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Plan</p>
          <p className="mt-2 text-xl font-semibold text-slate-950">{trial.canceled ? 'Canceled' : trial.cancelScheduled ? 'Cancels at period end' : trial.expired ? 'Trial ended' : trial.activeTrial ? 'Trial mode' : workspace?.planName ?? 'Active plan'}</p>
          <p className="mt-2 text-sm text-slate-500">{trial.canceled ? 'Subscription has ended for this workspace' : trial.cancelScheduled ? (paidThroughLabel ? `Access remains active until ${paidThroughLabel}` : 'Access remains active until the current billing period ends') : trial.expired ? 'Upgrade needed to keep using this workspace' : trial.activeTrial ? '7-day trial in progress' : 'Active billing'}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Monthly plan</p>
          <p className="mt-2 text-xl font-semibold text-slate-950">{formatMonthlyPriceGbp(WORKSPACE_MONTHLY_PRICE_GBP)}</p>
          <p className="mt-2 text-sm text-slate-500">Recommended launch price per workspace</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Quotes tracked</p>
          <p className="mt-2 text-xl font-semibold text-slate-950">{metrics.totalQuotes}</p>
          <p className="mt-2 text-sm text-slate-500">Records in this workspace</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Due today</p>
          <p className="mt-2 text-xl font-semibold text-slate-950">{dueToday}</p>
          <p className="mt-2 text-sm text-slate-500">Quotes needing follow-up now</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className={`rounded-3xl border bg-white p-6 shadow-sm lg:col-span-2 ${showUpgradeHighlight ? 'border-amber-300 ring-2 ring-amber-200' : 'border-slate-200'}`}>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Billing</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">{BILLING_MODEL_COPY.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{BILLING_MODEL_COPY.summary}</p>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Launch price</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{formatMonthlyPriceGbp(WORKSPACE_MONTHLY_PRICE_GBP)}</p>
              <p className="mt-2 text-sm text-slate-600">One paid workspace covers the owner and their teammates.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Signup</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{BILLING_MODEL_COPY.signup}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Teammates</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{BILLING_MODEL_COPY.teammate}</p>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <span className="font-medium">Billing status:</span>{' '}
            {trial.canceled
              ? (workspace?.role === 'owner' ? BILLING_MODEL_COPY.canceledOwner : BILLING_MODEL_COPY.canceledMember)
              : trial.cancelScheduled
                ? (paidThroughLabel
                    ? `This subscription is set to end on ${paidThroughLabel}. Full access stays active until then.`
                    : 'This subscription is set to end at the close of the current billing period. Full access stays active until then.')
                : trial.expired
                  ? (workspace?.role === 'owner' ? BILLING_MODEL_COPY.expiredOwner : BILLING_MODEL_COPY.expiredMember)
                  : trial.activeTrial
                    ? `${trial.daysLeft} day${trial.daysLeft === 1 ? '' : 's'} left in your 7-day workspace trial.`
                    : 'This workspace is on an active paid plan.'}
            {(trial.expired || trial.canceled) && workspace?.role === 'owner' ? (
              <div className="mt-4">
                <Link href={STRIPE_CHECKOUT_URL} className="inline-flex rounded-xl border border-rose-700 bg-rose-600 px-4 py-2.5 text-sm font-medium !text-white text-white transition hover:bg-rose-500" target="_blank" rel="noreferrer">
                  {BILLING_MODEL_COPY.cta}
                </Link>
              </div>
            ) : null}
          </div>
        </div>

        {showLockedState ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Workspace access</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">Read-only until billing is active</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Quote editing, new quotes, team changes, and workspace updates are paused until this workspace has an active subscription.
            </p>
          </div>
        ) : (
          <>
            <form action={updateWorkspaceAction} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Workspace</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">Workspace name</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Change the name shown across the product for this workspace.</p>
              <label className="mt-5 block text-sm font-medium text-slate-700">
                Name
                <input name="workspaceName" defaultValue={workspace?.workspaceName ?? ''} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-sky-500" required />
              </label>
              <button className="mt-5 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800" type="submit">
                Save workspace
              </button>
            </form>

            <form action={updateProfileAction} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Account</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">Profile</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Keep the account details clean for this workspace owner.</p>
              <label className="mt-5 block text-sm font-medium text-slate-700">
                Name
                <input name="name" defaultValue={user?.name ?? ''} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-sky-500" required />
              </label>
              <label className="mt-4 block text-sm font-medium text-slate-700">
                Email
                <input value={user?.email ?? ''} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500 outline-none" disabled readOnly />
              </label>
              <button className="mt-5 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800" type="submit">
                Save profile
              </button>
            </form>
          </>
        )}
      </div>

      <div className="space-y-4">
        {workspace?.role === 'owner' ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Subscription</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">Manage subscription</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {trial.activeTrial
                ? 'You are still in trial mode, so there is no paid subscription to cancel yet.'
                : trial.canceled
                  ? 'This workspace subscription has already ended.'
                  : trial.cancelScheduled
                    ? (paidThroughLabel ? `Cancellation is scheduled. Access stays active until ${paidThroughLabel}.` : 'Cancellation is scheduled for the end of the current billing period.')
                    : 'Canceling now will keep access active until the end of the current billing period.'}
            </p>
            {workspace.subscriptionStatus === 'active' && !trial.cancelScheduled ? (
              <form action={cancelSubscriptionAction} className="mt-5">
                <button
                  type="submit"
                  className="inline-flex rounded-xl border border-rose-300 bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700 transition hover:border-rose-400 hover:bg-rose-100"
                >
                  {BILLING_MODEL_COPY.cancelCta}
                </button>
              </form>
            ) : trial.cancelScheduled || trial.canceled ? (
              <div className="mt-5">
                <Link href={STRIPE_CHECKOUT_URL} className="inline-flex rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:border-slate-400 hover:bg-slate-50">
                  Restart subscription
                </Link>
              </div>
            ) : null}
          </div>
        ) : null}

        <AddTeammateForm disabled={showLockedState} />

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Team</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">Team members</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">These are the people who currently have access to this workspace. The owner can remove members at any time.</p>
          <div className="mt-5 space-y-3">
            {members.map((member) => (
              <div key={member.userId} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-950">{member.name}</p>
                  <p className="text-sm text-slate-500">{member.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-white">{member.role}</span>
                  {member.role !== 'owner' ? <RemoveMemberButton memberUserId={member.userId} disabled={!canManageMembers} /> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
