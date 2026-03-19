create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  contact_name text,
  email text,
  company text,
  title text not null,
  value numeric(12,2) not null default 0,
  status text not null check (status in ('draft', 'sent', 'follow-up due', 'replied', 'won', 'lost')),
  sent_date date,
  notes text,
  template_key text not null check (template_key in ('friendly', 'nudge', 'checkin')),
  follow_up_offsets jsonb not null default '[2,5,9]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_quotes_status on public.quotes(status);
create index if not exists idx_quotes_sent_date on public.quotes(sent_date);
create index if not exists idx_quotes_updated_at on public.quotes(updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

drop trigger if exists trg_quotes_updated_at on public.quotes;
create trigger trg_quotes_updated_at
before update on public.quotes
for each row execute function public.set_updated_at();
