create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  is_template boolean not null default false,
  owner_user_id uuid references public.users(id) on delete set null,
  referral_code text,
  referred_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_memberships (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table if not exists public.subscriptions (
  workspace_id uuid primary key references public.workspaces(id) on delete cascade,
  status text not null default 'trialing' check (status in ('trialing', 'active', 'past_due', 'canceled')),
  plan_name text,
  monthly_price_gbp integer not null default 0,
  provider text,
  provider_customer_id text,
  provider_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions alter column monthly_price_gbp type numeric(10,2);
alter table public.subscriptions alter column status set default 'trialing';
alter table public.subscriptions drop constraint if exists subscriptions_status_check;
alter table public.subscriptions add constraint subscriptions_status_check check (status in ('trialing', 'active', 'past_due', 'canceled'));
alter table public.workspaces drop constraint if exists workspaces_currency_code_check;
alter table public.workspaces add constraint workspaces_currency_code_check check (currency_code in ('GBP', 'USD', 'EUR', 'AUD', 'CAD'));
alter table public.subscriptions add column if not exists current_period_end timestamptz;
alter table public.subscriptions add column if not exists cancel_at_period_end boolean not null default false;
alter table public.subscriptions add column if not exists canceled_at timestamptz;

update public.subscriptions
set cancel_at_period_end = false
where cancel_at_period_end is null;

update public.subscriptions
set status = 'trialing'
where status = 'demo';

update public.subscriptions
set current_period_end = null
where status = 'trialing';

update public.subscriptions
set current_period_end = coalesce(current_period_end, now() + interval '1 month')
where status in ('active', 'past_due') and current_period_end is null;

update public.subscriptions
set canceled_at = null
where status in ('trialing', 'active', 'past_due') and cancel_at_period_end = false;

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  contact_name text,
  email text,
  company text,
  title text not null,
  value numeric(12,2) not null default 0,
  status text not null check (status in ('draft', 'sent', 'due', 'replied', 'won', 'lost')),
  sent_date date,
  notes text,
  template_key text not null check (template_key in ('friendly', 'nudge', 'checkin')),
  follow_up_offsets jsonb not null default '[2,5,9]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users add column if not exists default_workspace_id uuid references public.workspaces(id) on delete set null;
alter table public.workspaces add column if not exists referral_code text;
alter table public.workspaces add column if not exists referred_at timestamptz;
alter table public.workspaces add column if not exists currency_code text not null default 'GBP';
alter table public.quotes add column if not exists workspace_id uuid references public.workspaces(id) on delete cascade;
alter table public.quotes drop constraint if exists quotes_status_check;
alter table public.quotes add constraint quotes_status_check check (status in ('draft', 'sent', 'due', 'replied', 'won', 'lost'));

update public.quotes
set status = 'due'
where status = 'follow-up due';

create index if not exists idx_quotes_workspace_id on public.quotes(workspace_id);
create index if not exists idx_quotes_status on public.quotes(status);
create index if not exists idx_quotes_sent_date on public.quotes(sent_date);
create index if not exists idx_quotes_updated_at on public.quotes(updated_at desc);
create index if not exists idx_workspace_memberships_user_id on public.workspace_memberships(user_id);
create index if not exists idx_users_default_workspace_id on public.users(default_workspace_id);
create index if not exists idx_workspaces_referral_code on public.workspaces(referral_code);

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

drop trigger if exists trg_workspaces_updated_at on public.workspaces;
create trigger trg_workspaces_updated_at
before update on public.workspaces
for each row execute function public.set_updated_at();

drop trigger if exists trg_subscriptions_updated_at on public.subscriptions;
create trigger trg_subscriptions_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

drop trigger if exists trg_quotes_updated_at on public.quotes;
create trigger trg_quotes_updated_at
before update on public.quotes
for each row execute function public.set_updated_at();

-- No demo workspace bootstrap here.
-- Production workspaces are provisioned per user by application logic,
-- so new accounts always start with a clean private workspace.
