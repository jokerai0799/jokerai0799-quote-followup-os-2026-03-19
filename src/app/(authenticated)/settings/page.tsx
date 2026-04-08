import { auth } from '@/auth'
import { AddTeammateForm } from './add-teammate-form'
import { LocalizedBillingPrice } from './localized-billing-price'
import { RemoveMemberButton } from './remove-member-button'
import { cancelSubscriptionAction, startSubscriptionCheckoutAction, updateWorkspaceAction } from './actions'
import { BILLING_MODEL_COPY } from '@/lib/billing'
import { WORKSPACE_CURRENCY_OPTIONS } from '@/lib/currency'
import { getDailyChaseList, getMetrics, getQuotes } from '@/lib/quotes'
import { getTrialState } from '@/lib/trial'
import { getWorkspaceContextForUser, getWorkspaceMembers } from '@/lib/workspaces'

type PageProps = {
  searchParams: Promise<{ billing?: string; saved?: string }>
}

export default async function SettingsPage({ searchParams }: PageProps) {
  const session = await auth()
  if (!session?.user?.id) {
    return null
  }

  const { billing, saved } = await searchParams
  const [workspace, quotes] = await Promise.all([
    getWorkspaceContextForUser(session.user.id),
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
  const isOwner = workspace?.role === 'owner'
  const canManageMembers = isOwner && !trial.expired && !trial.canceled
  const showLockedState = trial.expired || trial.canceled
  const paidThroughLabel = trial.paidThrough
    ? new Date(trial.paidThrough).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : null
  const savedMessage = saved === 'workspace'
    ? 'Workspace name updated.'
    : null

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Settings</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-950">Workspace and account</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Update your workspace details, manage team access, and review how billing applies to the workspace you are currently in.
        </p>
        {savedMessage ? (
          <div className="mt-4 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
            {savedMessage}
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Plan</p>
          <p className="mt-2 text-xl font-semibold text-slate-950">{trial.canceled ? 'Canceled' : trial.cancelScheduled ? 'Cancels at period end' : trial.expired ? 'Trial ended' : trial.activeTrial ? 'Trial mode' : workspace?.planName ?? 'Active plan'}</p>
          <p className="mt-2 text-sm text-slate-500">{trial.canceled ? 'Subscription has ended for this workspace' : trial.cancelScheduled ? (paidThroughLabel ? `Access remains active until ${paidThroughLabel}` : 'Access remains active until the current billing period ends') : trial.expired ? 'Upgrade needed to keep using this workspace' : trial.activeTrial ? '7-day trial in progress' : 'Active billing'}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Stripe billing</p>
          <p className="mt-2 text-xl font-semibold text-slate-950"><LocalizedBillingPrice /></p>
          <p className="mt-2 text-sm text-slate-500">Checkout and billing are managed securely by Stripe.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Workspace quote currency</p>
          <p className="mt-2 text-xl font-semibold text-slate-950">{workspace?.currencyCode ?? 'GBP'}</p>
          <p className="mt-2 text-sm text-slate-500">Used for quote values, dashboard totals, and quote forms across this workspace.</p>
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
              <p className="mt-2 text-2xl font-semibold text-slate-950"><LocalizedBillingPrice /></p>
              <p className="mt-2 text-sm text-slate-600">Checkout and billing are managed securely by Stripe.</p>
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
          <div className="mt-4 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            {workspace?.role === 'owner' && workspace?.subscriptionStatus !== 'active' ? (
              <div className="flex flex-col gap-3 rounded-2xl border border-sky-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-slate-950">Ready to activate this workspace?</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Start the subscription now and activate paid access for this workspace immediately.
                  </p>
                </div>
                <form action={startSubscriptionCheckoutAction}>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-xl border border-emerald-600 bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-emerald-500 hover:bg-emerald-500"
                  >
                    Subscribe now
                  </button>
                </form>
              </div>
            ) : null}

            <div>
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
                      ? `Trial ends in ${trial.daysLeft} day${trial.daysLeft === 1 ? '' : 's'}. Upgrade to keep your workspace running.`
                      : 'This workspace is on an active paid plan.'}
            </div>
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
            {isOwner ? (
              <form action={updateWorkspaceAction} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Workspace</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">Workspace details</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Change the name shown across the product and choose the currency used for quotes in this workspace. Subscription billing is handled separately through Stripe.</p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Name
                    <input name="workspaceName" defaultValue={workspace?.workspaceName ?? ''} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-sky-500" required />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Workspace currency
                    <select name="currencyCode" defaultValue={workspace?.currencyCode ?? 'GBP'} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-sky-500">
                      {WORKSPACE_CURRENCY_OPTIONS.map((currency) => (
                        <option key={currency.value} value={currency.value}>
                          {currency.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <button className="mt-5 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800" type="submit">
                  Save
                </button>
              </form>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Workspace</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">Workspace details</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Only the workspace owner can change the workspace name or currency.</p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
                    {workspace?.workspaceName ?? 'Workspace'}
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
                    {workspace?.currencyCode ?? 'GBP'}
                  </div>
                </div>
              </div>
            )}
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
                ? 'You’re currently on trial. There’s no paid subscription to manage yet.'
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
              <form action={startSubscriptionCheckoutAction} className="mt-5">
                <button type="submit" className="inline-flex rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:border-slate-400 hover:bg-slate-50">
                  Restart subscription
                </button>
              </form>
            ) : null}
          </div>
        ) : null}

        {isOwner ? (
          <AddTeammateForm disabled={showLockedState} />
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Team access</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">Team management</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Only the workspace owner can add or remove teammates in this workspace.
            </p>
          </div>
        )}

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Team</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">Team members</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">These are the people who currently have access to this workspace. Invited members can use this workspace under its subscription, and the owner can remove members at any time.</p>
          <div className="mt-5 space-y-3">
            {members.map((member) => (
              <div key={member.userId} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-slate-950">{member.name}</p>
                  <p className="break-words text-sm text-slate-500">{member.email}</p>
                </div>
                <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-start">
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
