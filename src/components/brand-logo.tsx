import Link from 'next/link'

type BrandLogoProps = {
  compact?: boolean
  href?: string
  showTagline?: boolean
}

export function BrandLogo({ compact = false, href = '/', showTagline = true }: BrandLogoProps) {
  return (
    <Link href={href} className="inline-flex shrink-0 items-center gap-3 text-white">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/8 bg-slate-900 shadow-[0_8px_30px_rgba(2,6,23,0.35)]">
        <svg viewBox="0 0 36 36" className="h-8 w-8" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="8" fill="#1A2B42" />
          <rect width="36" height="36" rx="8" fill="none" stroke="white" strokeWidth="0.8" opacity="0.08" />
          <rect x="6" y="5" width="16" height="21" rx="2.5" fill="#243651" />
          <rect x="6" y="5" width="16" height="21" rx="2.5" stroke="#2E4E74" strokeWidth="1.2" />
          <polygon points="17,5 22,10 17,10" fill="#152030" />
          <polyline points="17,5 17,10 22,10" stroke="#2E4E74" strokeWidth="1.2" strokeLinejoin="round" />
          <rect x="9" y="13" width="6" height="1.8" rx="0.9" fill="#3B82F6" opacity="0.9" />
          <rect x="9" y="16.5" width="9" height="1.8" rx="0.9" fill="#4B6A8A" opacity="0.6" />
          <rect x="9" y="20" width="7" height="1.8" rx="0.9" fill="#4B6A8A" opacity="0.45" />
          <line x1="23" y1="19" x2="31" y2="19" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" />
          <polyline points="27.5,15.5 31.5,19 27.5,22.5" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="31.5" cy="19" r="1.6" fill="#60A5FA" />
        </svg>
      </span>
      {!compact ? (
        <span className="flex min-w-0 flex-col leading-none">
          <span className="whitespace-nowrap font-serif text-[1.15rem] italic tracking-[-0.02em] text-white sm:text-[1.22rem]">
            Quote<span className="mx-1 inline-block h-[3px] w-[3px] rounded-full bg-sky-500 align-middle opacity-85" />FollowUp
          </span>
          {showTagline ? (
            <span className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-white/90 sm:text-[0.68rem]">
              Workspace
            </span>
          ) : null}
        </span>
      ) : null}
    </Link>
  )
}
