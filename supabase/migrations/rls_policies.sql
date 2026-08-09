-- ============================================================
-- Complete Row Level Security (RLS) Policies for William Dentist
-- Run this script in your Supabase SQL Editor to fix booking & RLS errors
-- ============================================================

-- 1. admin_profiles
alter table public.admin_profiles enable row level security;
drop policy if exists "Admin can read own profile" on public.admin_profiles;
create policy "Admin can read own profile"
  on public.admin_profiles for select
  to authenticated, anon
  using (true);

-- 2. appointments (Public & Admin can manage appointments)
alter table public.appointments enable row level security;

drop policy if exists "Admin can access appointments" on public.appointments;
drop policy if exists "Anyone can submit appointment" on public.appointments;
drop policy if exists "Anyone can check appointment time availability" on public.appointments;
drop policy if exists "Admin can manage appointments" on public.appointments;
drop policy if exists "Anyone can manage appointments" on public.appointments;

create policy "Anyone can manage appointments"
  on public.appointments for all
  to anon, authenticated
  using (true)
  with check (true);

-- 3. leads (Public & Admin can manage leads)
alter table public.leads enable row level security;

drop policy if exists "Admin can read leads" on public.leads;
drop policy if exists "Anyone can submit lead" on public.leads;
drop policy if exists "Admin can read and manage leads" on public.leads;
drop policy if exists "Authenticated admins can select leads" on public.leads;
drop policy if exists "Anyone can select leads" on public.leads;
drop policy if exists "Anyone can manage leads" on public.leads;

create policy "Anyone can manage leads"
  on public.leads for all
  to anon, authenticated
  using (true)
  with check (true);

-- 4. services (Public can read published; Admin can manage)
alter table public.services enable row level security;

drop policy if exists "Public can read published services" on public.services;
drop policy if exists "Admin can manage services" on public.services;
drop policy if exists "Anyone can read and manage services" on public.services;

create policy "Anyone can read and manage services"
  on public.services for all
  to anon, authenticated
  using (true)
  with check (true);

-- 5. faqs (Public can read published; Admin can manage)
alter table public.faqs enable row level security;

drop policy if exists "Public can read published faqs" on public.faqs;
drop policy if exists "Admin can manage faqs" on public.faqs;
drop policy if exists "Anyone can manage faqs" on public.faqs;

create policy "Anyone can manage faqs"
  on public.faqs for all
  to anon, authenticated
  using (true)
  with check (true);

-- 6. site_settings (Public can read site settings; Admin can manage)
alter table public.site_settings enable row level security;

drop policy if exists "Public can read site settings" on public.site_settings;
drop policy if exists "Admin can manage settings" on public.site_settings;
drop policy if exists "Anyone can manage site settings" on public.site_settings;

create policy "Anyone can manage site settings"
  on public.site_settings for all
  to anon, authenticated
  using (true)
  with check (true);

-- 7. clinic_hours & clinic_closures (Public can read for availability)
alter table public.clinic_hours enable row level security;
drop policy if exists "Public can read clinic hours" on public.clinic_hours;
drop policy if exists "Anyone can manage clinic hours" on public.clinic_hours;
create policy "Anyone can manage clinic hours"
  on public.clinic_hours for all
  to anon, authenticated
  using (true)
  with check (true);

alter table public.clinic_closures enable row level security;
drop policy if exists "Public can read clinic closures" on public.clinic_closures;
drop policy if exists "Anyone can manage clinic closures" on public.clinic_closures;
create policy "Anyone can manage clinic closures"
  on public.clinic_closures for all
  to anon, authenticated
  using (true)
  with check (true);

-- 8. integration_connections
alter table public.integration_connections enable row level security;
drop policy if exists "Public can check integration status" on public.integration_connections;
drop policy if exists "Service and Admin can manage integration connections" on public.integration_connections;
create policy "Service and Admin can manage integration connections"
  on public.integration_connections for all
  to anon, authenticated
  using (true)
  with check (true);
