-- Supabase Schema for William Dentist

create extension if not exists pgcrypto;

create table site_settings (
 id smallint primary key default 1 check (id = 1),
 clinic_name text not null,
 dentist_name text not null,
 phone text not null,
 email text not null,
 address_line1 text not null,
 city text not null,
 region text not null,
 postal_code text not null,
 timezone text not null default 'America/Chicago',
 slot_interval_minutes integer not null default 30 check (slot_interval_minutes in (15,30,60)),
 minimum_lead_hours integer not null default 2,
 booking_horizon_days integer not null default 60,
 google_calendar_id text,
 updated_at timestamptz not null default now()
);

create table admin_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null,
 role text not null default 'admin',
 is_active boolean not null default true,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table clinic_hours (
 day_of_week smallint primary key check (day_of_week between 0 and 6),
 opens_at time,
 closes_at time,
 is_closed boolean not null default false
);

create table clinic_closures (
 id uuid primary key default gen_random_uuid(),
 starts_at timestamptz not null,
 ends_at timestamptz not null,
 reason text,
 check (ends_at > starts_at)
);

create table services (
 id uuid primary key default gen_random_uuid(),
 slug text not null unique,
 name text not null,
 summary text not null,
 content text not null,
 duration_minutes integer not null default 60 check (duration_minutes > 0),
 price_text text,
 published boolean not null default false,
 display_order integer not null default 0,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table faqs (
 id uuid primary key default gen_random_uuid(),
 category text not null,
 question text not null,
 answer text not null,
 published boolean not null default false,
 display_order integer not null default 0,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table knowledge_items (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 category text not null,
 content text not null,
 published boolean not null default false,
 indexed_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table leads (
 id uuid primary key default gen_random_uuid(),
 reference text not null unique,
 source text not null check (source in ('contact_form','appointment_form','ai_chat','admin')),
 name text not null,
 phone text,
 email text,
 service_id uuid references services(id) on delete restrict,
 status text not null default 'new' check (status in ('new','contacted','qualified','appointment_requested','booked','follow_up','not_interested','closed')),
 message text,
 next_follow_up_at timestamptz,
 consent boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table lead_activities (
 id uuid primary key default gen_random_uuid(),
 lead_id uuid not null references leads(id) on delete cascade,
 activity_type text not null,
 metadata jsonb,
 created_by uuid references auth.users(id),
 created_at timestamptz not null default now()
);

create table appointments (
 id uuid primary key default gen_random_uuid(),
 reference text not null unique,
 idempotency_key uuid not null unique,
 lead_id uuid references leads(id) on delete set null,
 service_id uuid not null references services(id) on delete restrict,
 patient_name text not null,
 patient_phone text,
 patient_email text,
 patient_type text not null check (patient_type in ('new','returning')),
 start_at timestamptz not null,
 end_at timestamptz not null,
 status text not null default 'requested' check (status in ('requested','confirmed','completed','cancelled','no_show','reschedule_requested')),
 notes text,
 google_calendar_id text,
 google_event_id text,
 google_event_etag text,
 calendar_sync_status text not null default 'pending',
 calendar_last_synced_at timestamptz,
 calendar_error_message text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 check (end_at > start_at)
);

create table appointment_tokens (
 id uuid primary key default gen_random_uuid(),
 appointment_id uuid not null references appointments(id) on delete cascade,
 token_hash text not null unique,
 purpose text not null check (purpose in ('confirm', 'cancel', 'reschedule')),
 expires_at timestamptz not null,
 used_at timestamptz,
 created_at timestamptz not null default now()
);

create table appointment_holds (
 id uuid primary key default gen_random_uuid(),
 slot_start timestamptz not null,
 slot_end timestamptz not null,
 expires_at timestamptz not null,
 session_id text not null
);

create table conversations (
 id uuid primary key default gen_random_uuid(),
 lead_id uuid references leads(id) on delete set null,
 status text not null default 'active',
 source_page text,
 started_at timestamptz not null default now(),
 ended_at timestamptz,
 requires_human boolean not null default false
);

create table messages (
 id uuid primary key default gen_random_uuid(),
 conversation_id uuid not null references conversations(id) on delete cascade,
 role text not null check (role in ('user', 'assistant', 'system')),
 content text not null,
 intent text,
 confidence numeric,
 created_at timestamptz not null default now()
);

create table message_citations (
 message_id uuid not null references messages(id) on delete cascade,
 knowledge_item_id uuid not null references knowledge_items(id) on delete cascade,
 label text not null,
 primary key (message_id, knowledge_item_id)
);

create table integration_events (
 id uuid primary key default gen_random_uuid(),
 event_type text not null,
 direction text not null check (direction in ('inbound', 'outbound')),
 status text not null check (status in ('pending', 'success', 'failed', 'retrying')),
 payload jsonb,
 attempts integer not null default 0,
 response_code integer,
 error_message text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table audit_logs (
 id uuid primary key default gen_random_uuid(),
 user_id uuid references auth.users(id) on delete set null,
 action text not null,
 entity_type text not null,
 entity_id text,
 before_data jsonb,
 after_data jsonb,
 created_at timestamptz not null default now()
);

-- Indexes
create index leads_status_created_idx on leads(status, created_at desc);
create index leads_next_follow_up_idx on leads(next_follow_up_at);
create index appointments_start_status_idx on appointments(start_at, status);
create unique index appointments_google_event_unique on appointments(google_event_id) where google_event_id is not null;
create index messages_conversation_created_idx on messages(conversation_id, created_at);
create index integration_events_status_created_idx on integration_events(status, created_at desc);

-- Seed Data (Development Mode)
insert into site_settings (clinic_name, dentist_name, phone, email, address_line1, city, region, postal_code, timezone)
values ('William Dentist', 'Dr. William', '+1-555-123-4567', 'hello@williamdentist.online', '123 Smile Way', 'Beverly Hills', 'CA', '90210', 'America/Los_Angeles');

insert into clinic_hours (day_of_week, opens_at, closes_at, is_closed) values 
(0, null, null, true), -- Sunday
(1, '09:00', '17:00', false), -- Monday
(2, '09:00', '17:00', false), -- Tuesday
(3, '09:00', '17:00', false), -- Wednesday
(4, '09:00', '17:00', false), -- Thursday
(5, '09:00', '13:00', false), -- Friday
(6, null, null, true); -- Saturday

insert into services (slug, name, summary, content, duration_minutes, price_text, published, display_order) values
('whitening', 'Professional Whitening', 'Brighten your smile in just one visit.', 'Our advanced laser whitening technology provides immediate results with minimal sensitivity.', 60, 'Starting at $299', true, 1),
('cleaning', 'Comprehensive Cleaning', 'Routine checkup and professional cleaning.', 'Maintain optimal oral health with our thorough cleaning and examination.', 45, 'Covered by most insurance', true, 2),
('implants', 'Dental Implants', 'Permanent solution for missing teeth.', 'State-of-the-art implant procedures for a natural-looking and feeling restoration.', 120, 'Consultation required', true, 3),
('invisalign', 'Invisalign Clear Aligners', 'Straighten your teeth invisibly.', 'Custom-made clear aligners that comfortably straighten your teeth over time.', 30, 'Flexible financing available', true, 4);
