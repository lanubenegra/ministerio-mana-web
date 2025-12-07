-- Supabase tables for the new dynamics

-- 1) Prayer Wall
create table if not exists prayer_requests (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  city text,
  country text,
  prayers_count int not null default 0,
  approved boolean not null default true,
  created_at timestamptz default now()
);
alter table prayer_requests enable row level security;
create policy "read_public" on prayer_requests for select using (approved = true);

-- 2) Campus Reto (increments per event; aggregate by week_start)
create table if not exists campus_reto (
  id uuid primary key default gen_random_uuid(),
  campus text not null,
  amount int not null default 1,
  week_start date not null,
  created_at timestamptz default now()
);
alter table campus_reto enable row level security;
create policy "read_public" on campus_reto for select using (true);

-- 3) Newsletter
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  lang text default 'es',
  created_at timestamptz default now()
);
alter table newsletter_subscribers enable row level security;
create policy "read_public" on newsletter_subscribers for select using (false);

-- 4) Security throttle records (rate limiting)
create table if not exists security_throttle (
  id uuid primary key default gen_random_uuid(),
  identifier text not null,
  created_at timestamptz default now()
);

-- 5) Security events audit trail
create table if not exists security_events (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  identifier text,
  ip text,
  user_agent text,
  detail text,
  meta jsonb,
  created_at timestamptz default now()
);

-- 6) Donation events (Stripe / Wompi webhooks)
create table if not exists donation_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  kind text not null,
  reference text,
  payload jsonb not null,
  created_at timestamptz default now()
);
