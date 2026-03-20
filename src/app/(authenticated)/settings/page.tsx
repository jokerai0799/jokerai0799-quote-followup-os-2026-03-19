import Link from 'next/link'
import { auth } from '@/auth'
import { AddTeammateForm } from './add-teammate-form'
import { updateProfileAction, updateWorkspaceAction } from './actions'
import { BILLING_MODEL_COPY, STRIPE_CHECKOUT_URL, WORKSPACE_MONTHLY_PRICE_GBP, formatMonthlyPriceGbp } from '@/lib/billing'
import { getDailyChaseList, getMetrics, getQuotes } from '@/lib/quotes'
import { getTrialState } from '@/lib/trial'
import { findUserById } from '@/lib/users'
import { ensureWorkspaceForUser, getWorkspaceMembers } from '@/lib/workspaces'

const recommendations = [
  {
    title: 'Invite teammates and roles',
    verdict: 'Yes — makes sense soon',
    body: 'Useful once real businesses start using the product together. Add after the core owner workflow feels finished.',
  },
  {
    title: 'Email send history and delivery tracking',
    verdict: 'Yes — after in-app sending exists',
    body: 'Worth adding, but only once quotes and follow-ups can actually be sent from inside the product rather than copied out manually.',
  },
  {
    title: 'Analytics by source, service type, and win rate',
    verdict: 'Yes — high value',
    body: 'Very relevant to the product. This helps users see what work converts, what services perform best, and where leads are coming from.',
  },
]

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
  const trial = getTrialState({ createdAt: workspace?.createdAt, subscriptionStatus: workspace?.subscriptionStatus })
  const metrics = getMetrics(quotes)
  const dueToday = getDailyChaseList(quotes).length
  const showUpgradeHighlight = billing === 'upgrade' || trial.expired

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Settings</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-950">Workspace and account</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Update your workspace details, manage team access, and review billing and next steps.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Workspace</p>
          <p className="mt-2 text-xl font-semibold text-slate-950">{workspace?.workspaceName ?? 'Your Workspace'}</p>
          <p className="mt-2 text-sm text-slate-500">Current workspace name</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Plan</p>
          <p className="mt-2 text-xl font-semibold text-slate-950">{workspace?.planName ?? 'Demo'}</p>
          <p className="mt-2 text-sm text-slate-500">{trial.expired ? 'Trial ended' : trial.activeTrial ? 'Trial in progress' : 'Active billing'}</p>
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
          <div className="mt-5 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
            Competitor signal: Housecall Pro starts around $59/month, Tradify UK is about £34–£44 per user/month, and Fergus starts around $53/month. A focused QuoteFollowUp launch price of <span className="font-semibold">{formatMonthlyPriceGbp(WORKSPACE_MONTHLY_PRICE_GBP)}</span> per workspace is positioned lower and easier to say yes to.
          </div>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <span className="font-medium">Trial status:</span>{' '}
            {trial.expired
              ? (workspace?.role === 'owner' ? BILLING_MODEL_COPY.expiredOwner : BILLING_MODEL_COPY.expiredMember)
              : trial.activeTrial
                ? `${trial.daysLeft} day${trial.daysLeft === 1 ? '' : 's'} left in your 7-day workspace trial.`
                : 'This workspace is on an active paid plan.'}
            {trial.expired && workspace?.role === 'owner' ? (
              <div className="mt-4">
                <Link href={STRIPE_CHECKOUT_URL} className="inline-flex rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800" target="_blank" rel="noreferrer">
                  {BILLING_MODEL_COPY.cta}
                </Link>
              </div>
            ) : null}
          </div>
        </div>

        {trial.expired ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Workspace access</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">Read-only until upgraded</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Quote editing, new quotes, team changes, and workspace updates are paused until this workspace is upgraded.
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

      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <AddTeammateForm disabled={trial.expired} />

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Team</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">Team members</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">These are the people who currently have access to this workspace.</p>
            <div className="mt-5 space-y-3">
              {members.map((member) => (
                <div key={member.userId} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-950">{member.name}</p>
                    <p className="text-sm text-slate-500">{member.email}</p>
                  </div>
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-white">{member.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Roadmap</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">What we should build next</h3>
          <div className="mt-5 space-y-4">
            {recommendations.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sky-700">{item.verdict}</p>
                <h4 className="mt-2 text-lg font-semibold text-slate-950">{item.title}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
