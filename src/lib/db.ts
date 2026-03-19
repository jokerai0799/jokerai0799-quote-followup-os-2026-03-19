export const SUPABASE_PROJECT_REF = 'ehqizypdsfhmqojaetyd'
export const SUPABASE_URL = process.env.SUPABASE_URL ?? `https://${SUPABASE_PROJECT_REF}.supabase.co`

export function ensureDatabase() {
  if (!process.env.SUPABASE_URL) {
    throw new Error('SUPABASE_URL is not set')
  }

  if (!process.env.SUPABASE_SECRET_KEY) {
    throw new Error('SUPABASE_SECRET_KEY is not set')
  }
}
