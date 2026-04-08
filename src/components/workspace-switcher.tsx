import { setActiveWorkspaceAction } from '@/app/actions'
import { WorkspaceSwitcherSubmit } from '@/components/workspace-switcher-submit'
import { getWorkspaceDisplayName, type WorkspaceContext } from '@/lib/workspaces'

type WorkspaceSwitcherProps = {
  workspaces: WorkspaceContext[]
  activeWorkspaceId?: string | null
  user?: { id: string; name?: string | null; email?: string | null } | null
}

function getWorkspaceMetaLabel(workspace: WorkspaceContext, userId?: string | null) {
  if (workspace.ownerUserId && userId && workspace.ownerUserId === userId) {
    return 'Personal'
  }

  if (workspace.role === 'owner') {
    return 'Owner'
  }

  if (workspace.role === 'admin') {
    return 'Admin'
  }

  return 'Member'
}

export function WorkspaceSwitcher({ workspaces, activeWorkspaceId, user }: WorkspaceSwitcherProps) {
  if (!workspaces.length) {
    return null
  }

  const activeWorkspace = workspaces.find((workspace) => workspace.workspaceId === activeWorkspaceId) ?? workspaces[0]
  const activeLabel = getWorkspaceDisplayName(activeWorkspace, user)

  if (workspaces.length === 1) {
    return (
      <LinkLikeBadge label={activeLabel} meta={getWorkspaceMetaLabel(activeWorkspace, user?.id ?? null)} />
    )
  }

  return (
    <details className="relative w-full sm:w-auto">
      <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/90 transition hover:border-white/20 hover:bg-white/10 hover:text-white sm:w-auto sm:justify-start">
        <span className="max-w-[180px] truncate">{activeLabel}</span>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-white/70">
          {getWorkspaceMetaLabel(activeWorkspace, user?.id ?? null)}
        </span>
        <span className="text-xs text-white/60">▾</span>
      </summary>

      <div className="absolute left-0 right-0 z-20 mt-2 w-full max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 text-slate-900 shadow-[0_18px_50px_rgba(15,23,42,0.22)] sm:left-auto sm:right-0 sm:w-[280px] sm:min-w-[280px]">
        <div className="px-2 py-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Workspaces</p>
          <p className="mt-1 text-xs text-slate-500">Switch between your personal workspace and any team workspaces you belong to.</p>
        </div>
        <div className="space-y-1">
          {workspaces.map((workspace) => {
            const isActive = workspace.workspaceId === activeWorkspace.workspaceId
            return (
              <form key={workspace.workspaceId} action={setActiveWorkspaceAction}>
                <input type="hidden" name="workspaceId" value={workspace.workspaceId} />
                <WorkspaceSwitcherSubmit
                  label={getWorkspaceDisplayName(workspace, user)}
                  meta={getWorkspaceMetaLabel(workspace, user?.id ?? null)}
                  active={isActive}
                />
              </form>
            )
          })}
        </div>
      </div>
    </details>
  )
}

function LinkLikeBadge({ label, meta }: { label: string; meta: string }) {
  return (
    <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/90">
      <span className="max-w-[180px] truncate">{label}</span>
      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-white/70">{meta}</span>
    </div>
  )
}
