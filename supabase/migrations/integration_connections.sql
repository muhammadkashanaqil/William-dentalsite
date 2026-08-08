-- Create integration_connections table for persistent OAuth provider connections
create table if not exists public.integration_connections (
  id uuid primary key default gen_random_uuid(),
  provider text not null unique,
  status text not null default 'not_connected',
  calendar_id text default 'primary',
  refresh_token_encrypted text,
  connected_email text,
  granted_scopes text[],
  connected_at timestamptz,
  last_tested_at timestamptz,
  last_error text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Ensure provider is unique (required for upsert onConflict: "provider")
-- Safe to re-run: does nothing if constraint already exists
alter table public.integration_connections
  add constraint if not exists integration_connections_provider_unique
  unique (provider);

-- Enable RLS
alter table public.integration_connections enable row level security;

-- Policies
drop policy if exists "Enable all for authenticated service" on public.integration_connections;
create policy "Enable all for authenticated service"
  on public.integration_connections for all
  using (true)
  with check (true);
