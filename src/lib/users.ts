import { randomUUID } from 'node:crypto'
import { getDb } from './db'

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
  const db = getDb()
  const row = db
    .prepare(
      `SELECT id, email, name, password_hash, created_at, updated_at
       FROM users WHERE email = ?`,
    )
    .get(email) as UserRow | undefined

  if (!row) return null
  return mapRow(row)
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
  const db = getDb()
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as { id: string } | undefined
  const now = new Date().toISOString()

  if (existing) {
    db.prepare('UPDATE users SET name = ?, password_hash = ?, updated_at = ? WHERE id = ?').run(
      name,
      passwordHash,
      now,
      existing.id,
    )

    const row = db
      .prepare(
        `SELECT id, email, name, password_hash, created_at, updated_at
         FROM users WHERE id = ?`,
      )
      .get(existing.id) as UserRow

    return mapRow(row)
  }

  const id = randomUUID()
  db.prepare(
    `INSERT INTO users (id, email, name, password_hash, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(id, email, name, passwordHash, now, now)

  const row = db
    .prepare(
      `SELECT id, email, name, password_hash, created_at, updated_at
       FROM users WHERE id = ?`,
    )
    .get(id) as UserRow

  return mapRow(row)
}
