create table if not exists public.interns (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password text not null,
  created_at timestamptz default now()
);

alter table public.interns enable row level security;
alter table public.tasks
  add column if not exists intern_id uuid references public.interns(id) on delete set null;

create index if not exists tasks_intern_id_created_at_idx
  on public.tasks (intern_id, created_at desc);
