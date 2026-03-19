import DatabaseConstructor from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'

const DATA_DIR = path.join(process.cwd(), 'data')
export const DB_PATH = path.join(DATA_DIR, 'quotes.sqlite')

let db: DatabaseConstructor.Database | null = null
const MIGRATION_VERSION = 1

function ensureDirectories() {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

function applyMigrations(database: DatabaseConstructor.Database) {
  const currentVersion = database.pragma('user_version', { simple: true }) as number
  if (currentVersion >= MIGRATION_VERSION) {
    return
  }

  database.transaction(() => {
    database.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY NOT NULL,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS quotes (
        id TEXT PRIMARY KEY NOT NULL,
        client_name TEXT NOT NULL,
        contact_name TEXT,
        email TEXT,
        company TEXT,
        title TEXT NOT NULL,
        value REAL NOT NULL,
        status TEXT NOT NULL,
        sent_date TEXT,
        notes TEXT,
        template_key TEXT NOT NULL,
        follow_up_offsets TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
      CREATE INDEX IF NOT EXISTS idx_quotes_sent_date ON quotes(sent_date);
      CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `)

    database.pragma(`user_version = ${MIGRATION_VERSION}`)
  })()
}

export function getDb() {
  if (db) return db

  ensureDirectories()
  db = new DatabaseConstructor(DB_PATH)
  db.pragma('journal_mode = WAL')
  applyMigrations(db)
  return db
}

export function ensureDatabase() {
  getDb()
}
