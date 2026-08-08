-- Add Google OAuth & Integration status columns to site_settings table
alter table site_settings add column if not exists google_connected_email text;
alter table site_settings add column if not exists google_calendar_name text;
alter table site_settings add column if not exists google_refresh_token_encrypted text;
alter table site_settings add column if not exists google_status text default 'not_connected';
alter table site_settings add column if not exists google_last_tested_at timestamptz;
alter table site_settings add column if not exists google_last_error text;

-- Add partial unique index on appointments google_event_id
create unique index if not exists appointments_google_event_unique
on public.appointments (google_event_id)
where google_event_id is not null;
