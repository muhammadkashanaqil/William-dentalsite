-- ============================================================
-- Complete Row Level Security (RLS) Policies for William Dentist
-- Run this script in your Supabase SQL Editor to fix booking & RLS errors
-- ============================================================

-- 1. admin_profiles
alter table public.admin_profiles enable row level security;
drop policy if exists "Admin can read own profile" on public.admin_profiles;
create policy "Admin can read own profile"
  on public.admin_profiles for select
  to authenticated
  using (user_id = auth.uid());

-- 2. appointments (Public can submit & view for availability check; Admin can manage)
alter table public.appointments enable row level security;

drop policy if exists "Admin can access appointments" on public.appointments;

drop policy if exists "Anyone can submit appointment" on public.appointments;
create policy "Anyone can submit appointment"
  on public.appointments for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Anyone can check appointment time availability" on public.appointments;
create policy "Anyone can check appointment time availability"
  on public.appointments for select
  to anon, authenticated
  using (true);

drop policy if exists "Admin can manage appointments" on public.appointments;
create policy "Admin can manage appointments"
  on public.appointments for all
  to authenticated
  using (
    exists (
      select 1 from public.admin_profiles
      where user_id = auth.uid() and role = 'admin' and is_active = true
    )
  );

-- 3. leads (Public can submit leads; Admin can manage leads)
alter table public.leads enable row level security;

drop policy if exists "Admin can read leads" on public.leads;

drop policy if exists "Anyone can submit lead" on public.leads;
create policy "Anyone can submit lead"
  on public.leads for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admin can read and manage leads" on public.leads;
create policy "Admin can read and manage leads"
  on public.leads for all
  to authenticated
  using (
    exists (
      select 1 from public.admin_profiles
      where user_id = auth.uid() and role = 'admin' and is_active = true
    )
  );

-- 4. services (Public can read published; Admin can manage)
alter table public.services enable row level security;

drop policy if exists "Public can read published services" on public.services;
create policy "Public can read published services"
  on public.services for select
  to anon, authenticated
  using (published = true);

drop policy if exists "Admin can manage services" on public.services;
create policy "Admin can manage services"
  on public.services for all
  to authenticated
  using (
    exists (
      select 1 from public.admin_profiles
      where user_id = auth.uid() and role = 'admin' and is_active = true
    )
  );

-- 5. faqs (Public can read published; Admin can manage)
alter table public.faqs enable row level security;

drop policy if exists "Public can read published faqs" on public.faqs;
create policy "Public can read published faqs"
  on public.faqs for select
  to anon, authenticated
  using (published = true);

drop policy if exists "Admin can manage faqs" on public.faqs;
create policy "Admin can manage faqs"
  on public.faqs for all
  to authenticated
  using (
    exists (
      select 1 from public.admin_profiles
      where user_id = auth.uid() and role = 'admin' and is_active = true
    )
  );

-- 6. site_settings (Public can read site settings; Admin can manage)
alter table public.site_settings enable row level security;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "Admin can manage settings" on public.site_settings;
create policy "Admin can manage settings"
  on public.site_settings for all
  to authenticated
  using (
    exists (
      select 1 from public.admin_profiles
      where user_id = auth.uid() and role = 'admin' and is_active = true
    )
  );

-- 7. clinic_hours & clinic_closures (Public can read for availability)
alter table public.clinic_hours enable row level security;
drop policy if exists "Public can read clinic hours" on public.clinic_hours;
create policy "Public can read clinic hours"
  on public.clinic_hours for select
  to anon, authenticated
  using (true);

alter table public.clinic_closures enable row level security;
drop policy if exists "Public can read clinic closures" on public.clinic_closures;
create policy "Public can read clinic closures"
  on public.clinic_closures for select
  to anon, authenticated
  using (true);

-- 8. integration_connections
alter table public.integration_connections enable row level security;
drop policy if exists "Public can check integration status" on public.integration_connections;
create policy "Public can check integration status"
  on public.integration_connections for select
  to anon, authenticated
  using (true);

drop policy if exists "Service and Admin can manage integration connections" on public.integration_connections;
create policy "Service and Admin can manage integration connections"
  on public.integration_connections for all
  using (true)
  with check (true);
