import Image from 'next/image'
import Link from 'next/link'

type BrandLogoProps = {
  compact?: boolean
  href?: string
  variant?: 'light' | 'dark'
  className?: string
}

export function BrandLogo({ compact = false, href = '/', variant = 'light', className = '' }: BrandLogoProps) {
  const logoSrc = variant === 'dark' ? '/brand/quote-followup-logo-on-white.svg' : '/brand/quote-followup-logo-on-blue.svg'

  return (
    <Link href={href} className={`inline-flex shrink-0 items-center gap-3 ${className}`.trim()}>
      {compact ? (
        <Image
          src="/brand/quote-followup-icon.svg"
          alt="Quote FollowUp"
          width={44}
          height={44}
          className="h-11 w-11 rounded-2xl"
          priority
        />
      ) : (
        <Image
          src={logoSrc}
          alt="Quote FollowUp"
          width={360}
          height={72}
          className="h-10 w-auto sm:h-11"
          priority
        />
      )}
    </Link>
  )
}
