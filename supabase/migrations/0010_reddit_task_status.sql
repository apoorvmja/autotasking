create table if not exists public.reddit_task_status (
  id uuid primary key default gen_random_uuid(),
  intern_id uuid references public.interns(id) on delete cascade,
  destination_id uuid references public.posting_destinations(id) on delete cascade,
  task_date date not null,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz default now(),
  unique (intern_id, destination_id, task_date)
);

alter table public.reddit_task_status enable row level security;

create policy "Public read reddit task status" on public.reddit_task_status
  for select
  using (true);

create policy "Public insert reddit task status" on public.reddit_task_status
  for insert
  with check (true);

create policy "Public update reddit task status" on public.reddit_task_status
  for update
  using (true)
  with check (true);

grant select, insert, update on table public.reddit_task_status to anon, authenticated;
