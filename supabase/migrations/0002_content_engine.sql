create table if not exists public.daily_questions (
  id bigint generated always as identity primary key,
  category text not null,
  question_title text not null,
  question_body text not null,
  difficulty text,
  tags text[],
  country_focus text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.universities (
  id bigint generated always as identity primary key,
  name text not null,
  city text,
  website text,
  known_for text,
  approx_tuition_aed int,
  notes text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.programs (
  id bigint generated always as identity primary key,
  university_id bigint references public.universities(id) on delete cascade,
  program_name text not null,
  level text,
  duration_months int,
  intake_months text[],
  approx_fee_aed int,
  requirements text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.cost_items (
  id bigint generated always as identity primary key,
  item text not null,
  min_aed int,
  max_aed int,
  notes text,
  source_hint text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.post_queue (
  id bigint generated always as identity primary key,
  post_date date not null unique,
  content_type text not null check (content_type in ('question', 'university', 'cost')),
  content_id bigint not null,
  status text default 'pending' check (status in ('pending', 'posted', 'skipped')),
  assigned_to text,
  posted_url text,
  posted_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists daily_questions_active_idx on public.daily_questions (is_active);
create index if not exists universities_active_idx on public.universities (is_active);
create index if not exists programs_university_idx on public.programs (university_id);
create index if not exists cost_items_active_idx on public.cost_items (is_active);
create index if not exists post_queue_date_idx on public.post_queue (post_date);

alter table public.daily_questions enable row level security;
alter table public.universities enable row level security;
alter table public.programs enable row level security;
alter table public.cost_items enable row level security;
alter table public.post_queue enable row level security;

create policy "Public read daily_questions" on public.daily_questions
  for select
  using (true);

create policy "Public read universities" on public.universities
  for select
  using (true);

create policy "Public read programs" on public.programs
  for select
  using (true);

create policy "Public read cost_items" on public.cost_items
  for select
  using (true);

create policy "Public read post_queue" on public.post_queue
  for select
  using (true);

create policy "Public insert post_queue" on public.post_queue
  for insert
  with check (true);

create policy "Public update post_queue" on public.post_queue
  for update
  using (true);

grant select on table public.daily_questions to anon, authenticated;
grant select on table public.universities to anon, authenticated;
grant select on table public.programs to anon, authenticated;
grant select on table public.cost_items to anon, authenticated;
grant select, insert, update on table public.post_queue to anon, authenticated;
