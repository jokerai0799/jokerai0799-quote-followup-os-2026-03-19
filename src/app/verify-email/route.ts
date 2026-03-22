import { NextResponse } from 'next/server'
import { readEmailVerificationToken } from '@/lib/email-verification'
import { markUserEmailVerified, findUserByEmail } from '@/lib/users'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const token = url.searchParams.get('token')?.trim()

  if (!token) {
    return NextResponse.redirect(new URL('/login?verified=invalid', url))
  }

  try {
    const { email } = readEmailVerificationToken(token)
    const user = await findUserByEmail(email)
    if (!user) {
      return NextResponse.redirect(new URL('/login?verified=invalid', url))
    }

    await markUserEmailVerified(user.id)
    return NextResponse.redirect(new URL(`/login?verified=success&email=${encodeURIComponent(user.email)}`, url))
  } catch {
    return NextResponse.redirect(new URL('/login?verified=invalid', url))
  }
}
