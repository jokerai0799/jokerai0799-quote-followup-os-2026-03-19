import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { touchUserActivity } from '@/lib/users'

export const dynamic = 'force-dynamic'

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await touchUserActivity(session.user.id)

  return NextResponse.json({ ok: true, touchedAt: new Date().toISOString() }, { headers: { 'Cache-Control': 'no-store' } })
}
