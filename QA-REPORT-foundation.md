# QA Report — historical note

This file documents an earlier SQLite + middleware runtime failure that applied before the Supabase migration.

## Current status

It is no longer the active architecture reference.

The app now uses:
- Supabase Postgres for persistence
- server-side auth checks in the authenticated layout
- Vercel-compatible hosted data instead of local SQLite

For the current product state, rely on the live code, README, and fresh smoke-test results rather than this historical foundation note.
