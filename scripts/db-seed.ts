import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import bcrypt from 'bcryptjs'
import { ensureDatabase, getDb } from '../src/lib/db'
import { STATUSES, TEMPLATE_KEYS, type QuoteInput } from '../src/lib/quotes'
import { upsertUserByEmail } from '../src/lib/users'

type SeedQuote = Partial<QuoteInput> & {
  id: string
  createdAt?: string
  updatedAt?: string
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

function seedQuotesIfEmpty() {
  const db = getDb()
  const { count } = db.prepare('SELECT COUNT(*) as count FROM quotes').get() as { count: number }
  if (count > 0) {
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

  const insert = db.prepare(`
    INSERT INTO quotes (
      id,
      client_name,
      contact_name,
      email,
      company,
      title,
      value,
      status,
      sent_date,
      notes,
      template_key,
      follow_up_offsets,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const now = new Date().toISOString()
  const transaction = db.transaction(() => {
    for (const record of records) {
      const status = STATUSES.includes((record.status ?? 'draft') as (typeof STATUSES)[number])
        ? ((record.status ?? 'draft') as (typeof STATUSES)[number])
        : 'draft'
      const templateKey = TEMPLATE_KEYS.includes((record.templateKey ?? 'friendly') as (typeof TEMPLATE_KEYS)[number])
        ? ((record.templateKey ?? 'friendly') as (typeof TEMPLATE_KEYS)[number])
        : 'friendly'

      insert.run(
        record.id,
        record.clientName ?? 'Unknown client',
        record.contactName ?? '',
        record.email ?? '',
        record.company ?? '',
        record.title ?? 'Untitled quote',
        Number(record.value) || 0,
        status,
        record.sentDate || null,
        record.notes ?? '',
        templateKey,
        JSON.stringify(record.followUpOffsets ?? [2, 5, 9]),
        record.createdAt ?? now,
        record.updatedAt ?? now,
      )
    }
  })

  transaction()
  console.log(`Imported ${records.length} demo quotes from data/quotes.json`)
}

async function main() {
  ensureDatabase()
  await seedUser()
  seedQuotesIfEmpty()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
