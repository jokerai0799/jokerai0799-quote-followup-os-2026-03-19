import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { ensureDatabase } from '../src/lib/db'
import { STATUSES, TEMPLATE_KEYS, type QuoteInput } from '../src/lib/quotes'
import { supabase } from '../src/lib/supabase'
import { upsertUserByEmail } from '../src/lib/users'

type SeedQuote = Partial<QuoteInput> & {
  id: string
  createdAt?: string
  updatedAt?: string
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function normalizeId(id?: string) {
  return id && uuidPattern.test(id) ? id : randomUUID()
}

async function seedUser() {
  const email = process.env.AUTH_EMAIL ?? 'founder@example.com'
  const password = process.env.AUTH_PASSWORD ?? 'change-me'
  const name = process.env.AUTH_NAME ?? 'Workspace Owner'

  if (!password) {
    throw new Error('AUTH_PASSWORD must be set before seeding users')
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await upsertUserByEmail({ email, name, passwordHash })
  console.log(`Seeded workspace user ${user.email}`)
}

async function seedQuotesIfEmpty() {
  const { count, error: countError } = await supabase
    .from('quotes')
    .select('*', { count: 'exact', head: true })

  if (countError) {
    throw new Error(`Failed to inspect quotes table: ${countError.message}`)
  }

  if ((count ?? 0) > 0) {
    console.log('Quotes table already contains data — skipping demo import.')
    return
  }

  const seedFile = path.join(process.cwd(), 'data', 'quotes.json')
  if (!fs.existsSync(seedFile)) {
    console.log('No data/quotes.json file found — skipping demo import.')
    return
  }

  const raw = fs.readFileSync(seedFile, 'utf8')
  const records = JSON.parse(raw) as SeedQuote[]
  if (!records.length) {
    console.log('Seed file was empty — nothing to import.')
    return
  }

  const now = new Date().toISOString()
  const payload = records.map((record) => {
    const status = STATUSES.includes((record.status ?? 'draft') as (typeof STATUSES)[number])
      ? ((record.status ?? 'draft') as (typeof STATUSES)[number])
      : 'draft'
    const templateKey = TEMPLATE_KEYS.includes((record.templateKey ?? 'friendly') as (typeof TEMPLATE_KEYS)[number])
      ? ((record.templateKey ?? 'friendly') as (typeof TEMPLATE_KEYS)[number])
      : 'friendly'

    return {
      id: normalizeId(record.id),
      client_name: record.clientName ?? 'Unknown client',
      contact_name: record.contactName ?? null,
      email: record.email ?? null,
      company: record.company ?? null,
      title: record.title ?? 'Untitled quote',
      value: Number(record.value) || 0,
      status,
      sent_date: record.sentDate || null,
      notes: record.notes ?? null,
      template_key: templateKey,
      follow_up_offsets: record.followUpOffsets ?? [2, 5, 9],
      created_at: record.createdAt ?? now,
      updated_at: record.updatedAt ?? now,
    }
  })

  const { error } = await supabase.from('quotes').insert(payload)
  if (error) {
    throw new Error(`Failed to import demo quotes: ${error.message}`)
  }

  console.log(`Imported ${records.length} demo quotes from data/quotes.json`)
}

async function main() {
  ensureDatabase()
  await seedUser()
  await seedQuotesIfEmpty()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
