create table if not exists public.youtube_task_status (
  id uuid primary key default gen_random_uuid(),
  intern_id uuid references public.interns(id) on delete cascade,
  video_id uuid references public.youtube_videos(id) on delete cascade,
  task_date date not null,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz default now(),
  unique (intern_id, video_id, task_date)
);

alter table public.youtube_task_status enable row level security;

create policy "Public read youtube task status" on public.youtube_task_status
  for select
  using (true);

create policy "Public insert youtube task status" on public.youtube_task_status
  for insert
  with check (true);

create policy "Public update youtube task status" on public.youtube_task_status
  for update
  using (true)
  with check (true);

grant select, insert, update on table public.youtube_task_status to anon, authenticated;
