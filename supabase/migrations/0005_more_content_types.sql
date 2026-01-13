create table if not exists public.university_cards (
  id bigint generated always as identity primary key,
  destination_id uuid references public.posting_destinations(id) on delete set null,
  university_name text not null,
  program_name text,
  location text,
  level text,
  duration_months int,
  intake_months text[],
  approx_fee_aed int,
  known_for text,
  requirements text,
  notes text,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.cost_items
  add column if not exists destination_id uuid references public.posting_destinations(id) on delete set null;

create table if not exists public.visa_rules (
  id bigint generated always as identity primary key,
  destination_id uuid references public.posting_destinations(id) on delete set null,
  title text not null,
  rule_body text not null,
  tags text[],
  country_focus text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.comparison_posts (
  id bigint generated always as identity primary key,
  destination_id uuid references public.posting_destinations(id) on delete set null,
  title text not null,
  option_a text not null,
  option_b text not null,
  summary text,
  tags text[],
  country_focus text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.student_life_posts (
  id bigint generated always as identity primary key,
  destination_id uuid references public.posting_destinations(id) on delete set null,
  title text not null,
  body text not null,
  city text,
  country_focus text,
  tags text[],
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.real_stories (
  id bigint generated always as identity primary key,
  destination_id uuid references public.posting_destinations(id) on delete set null,
  title text not null,
  story text not null,
  background text,
  is_anonymous boolean default true,
  tags text[],
  country_focus text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create index if not exists university_cards_destination_idx on public.university_cards (destination_id);
create index if not exists cost_items_destination_idx on public.cost_items (destination_id);
create index if not exists visa_rules_destination_idx on public.visa_rules (destination_id);
create index if not exists comparison_posts_destination_idx on public.comparison_posts (destination_id);
create index if not exists student_life_posts_destination_idx on public.student_life_posts (destination_id);
create index if not exists real_stories_destination_idx on public.real_stories (destination_id);

alter table public.university_cards enable row level security;
alter table public.cost_items enable row level security;
alter table public.visa_rules enable row level security;
alter table public.comparison_posts enable row level security;
alter table public.student_life_posts enable row level security;
alter table public.real_stories enable row level security;

create policy "Public read university_cards" on public.university_cards
  for select
  using (true);

create policy "Public insert university_cards" on public.university_cards
  for insert
  with check (true);

drop policy if exists "Public read cost_items" on public.cost_items;

create policy "Public read cost_items" on public.cost_items
  for select
  using (true);

create policy "Public insert cost_items" on public.cost_items
  for insert
  with check (true);

create policy "Public read visa_rules" on public.visa_rules
  for select
  using (true);

create policy "Public insert visa_rules" on public.visa_rules
  for insert
  with check (true);

create policy "Public read comparison_posts" on public.comparison_posts
  for select
  using (true);

create policy "Public insert comparison_posts" on public.comparison_posts
  for insert
  with check (true);

create policy "Public read student_life_posts" on public.student_life_posts
  for select
  using (true);

create policy "Public insert student_life_posts" on public.student_life_posts
  for insert
  with check (true);

create policy "Public read real_stories" on public.real_stories
  for select
  using (true);

create policy "Public insert real_stories" on public.real_stories
  for insert
  with check (true);

grant select, insert on table public.university_cards to anon, authenticated;
grant select, insert on table public.cost_items to anon, authenticated;
grant select, insert on table public.visa_rules to anon, authenticated;
grant select, insert on table public.comparison_posts to anon, authenticated;
grant select, insert on table public.student_life_posts to anon, authenticated;
grant select, insert on table public.real_stories to anon, authenticated;

alter table public.posting_destinations
  drop constraint if exists posting_destinations_content_type_check;

alter table public.posting_destinations
  add constraint posting_destinations_content_type_check
  check (content_type in ('question', 'university', 'cost', 'visa', 'comparison', 'student_life', 'story'));

alter table public.post_queue
  drop constraint if exists post_queue_content_type_check;

alter table public.post_queue
  add constraint post_queue_content_type_check
  check (content_type in ('question', 'university', 'cost', 'visa', 'comparison', 'student_life', 'story'));
