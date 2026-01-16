create table if not exists public.youtube_videos (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid references public.posting_destinations(id) on delete cascade,
  title text not null,
  description text not null,
  file_path text not null,
  created_at timestamptz default now()
);

alter table public.youtube_videos enable row level security;

create policy "Public read youtube videos" on public.youtube_videos
  for select
  using (true);

create policy "Public insert youtube videos" on public.youtube_videos
  for insert
  with check (true);

create policy "Public delete youtube videos" on public.youtube_videos
  for delete
  using (true);

grant select, insert, delete on table public.youtube_videos to anon, authenticated;
