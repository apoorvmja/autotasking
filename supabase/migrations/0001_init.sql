create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  created_at timestamptz default now()
);

create table if not exists public.posting_destinations (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  name text not null,
  url text,
  created_at timestamptz default now()
);

alter table public.tasks enable row level security;
alter table public.posting_destinations enable row level security;

create policy "Public read tasks" on public.tasks
  for select
  using (true);

create policy "Public insert tasks" on public.tasks
  for insert
  with check (true);

create policy "Public read posting destinations" on public.posting_destinations
  for select
  using (true);

create policy "Public insert posting destinations" on public.posting_destinations
  for insert
  with check (true);

grant select, insert on table public.tasks to anon, authenticated;
grant select, insert on table public.posting_destinations to anon, authenticated;
