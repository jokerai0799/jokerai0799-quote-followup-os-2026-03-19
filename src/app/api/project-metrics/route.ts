import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const LIVE_USERS_WINDOW_MINUTES = 15

async function countUsersSince(column: 'created_at' | 'updated_at', sinceIso: string) {
  const { count, error } = await supabase
    .from('users')
    .select('id', { count: 'exact', head: true })
    .gte(column, sinceIso)

  if (error) {
    throw new Error(`Failed to count users by ${column}: ${error.message}`)
  }

  return count ?? 0
}

export async function GET() {
  const now = new Date()
  const liveSinceIso = new Date(now.getTime() - LIVE_USERS_WINDOW_MINUTES * 60_000).toISOString()
  const startOfDay = new Date(now)
  startOfDay.setUTCHours(0, 0, 0, 0)

  const [liveUsers, signupsToday] = await Promise.all([
    countUsersSince('updated_at', liveSinceIso),
    countUsersSince('created_at', startOfDay.toISOString()),
  ])

  return NextResponse.json(
    {
      ok: true,
      project: 'quote-followup-os',
      health: 'ok',
      liveUsers,
      signupsToday,
      storage: 'supabase',
      liveWindowMinutes: LIVE_USERS_WINDOW_MINUTES,
      generatedAt: now.toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
      },
    },
  )
}
