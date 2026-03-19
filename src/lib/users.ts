import { randomUUID } from 'node:crypto'
import { supabase } from './supabase'

export type UserRecord = {
  id: string
  email: string
  name: string
  passwordHash: string
  createdAt: string
  updatedAt: string
}

type UserRow = {
  id: string
  email: string
  name: string
  password_hash: string
  created_at: string
  updated_at: string
}

function mapRow(row: UserRow): UserRecord {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, name, password_hash, created_at, updated_at')
    .eq('email', email)
    .maybeSingle<UserRow>()

  if (error) {
    throw new Error(`Failed to fetch user: ${error.message}`)
  }

  return data ? mapRow(data) : null
}

export async function upsertUserByEmail({
  email,
  name,
  passwordHash,
}: {
  email: string
  name: string
  passwordHash: string
}): Promise<UserRecord> {
  const now = new Date().toISOString()
  const existing = await findUserByEmail(email)

  const payload = {
    id: existing?.id ?? randomUUID(),
    email,
    name,
    password_hash: passwordHash,
    created_at: existing?.createdAt ?? now,
    updated_at: now,
  }

  const { data, error } = await supabase
    .from('users')
    .upsert(payload, { onConflict: 'email' })
    .select('id, email, name, password_hash, created_at, updated_at')
    .single<UserRow>()

  if (error) {
    throw new Error(`Failed to upsert user: ${error.message}`)
  }

  return mapRow(data)
}
