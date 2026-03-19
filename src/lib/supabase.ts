import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

function getEnv() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY

  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL is not set')
  }

  if (!supabaseSecretKey) {
    throw new Error('SUPABASE_SECRET_KEY is not set')
  }

  return { supabaseUrl, supabaseSecretKey }
}

export function getSupabase() {
  if (client) {
    return client
  }

  const { supabaseUrl, supabaseSecretKey } = getEnv()
  client = createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return client
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getSupabase(), prop, receiver)
  },
})
