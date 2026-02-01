-- Add location and contact info to churches
alter table public.churches
  add column if not exists lat numeric,
  add column if not exists lng numeric,
  add column if not exists address text,
  add column if not exists contact_name text,
  add column if not exists contact_email text,
  add column if not exists contact_phone text;

-- Add RLS policy if not exists to allow public read (for the map and selectors)
alter table public.churches enable row level security;

create policy "Enable read access for all users"
on public.churches for select using (true);
