-- Portal Iglesias / Roles / Accesos
create extension if not exists "pgcrypto";

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.churches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  country text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.church_memberships (
  id uuid primary key default gen_random_uuid(),
  church_id uuid not null references public.churches(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'church_member',
  status text not null default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists church_memberships_unique
  on public.church_memberships(church_id, user_id);

create index if not exists church_memberships_user_idx
  on public.church_memberships(user_id);

-- Link de reservas manuales con portal iglesias
alter table cumbre_bookings
  add column if not exists source text;

alter table cumbre_bookings
  add column if not exists church_id uuid references public.churches(id);

alter table cumbre_bookings
  add column if not exists created_by uuid references auth.users(id);
