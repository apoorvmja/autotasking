alter table public.daily_questions
  add column if not exists destination_id uuid references public.posting_destinations(id) on delete set null;

create index if not exists daily_questions_destination_idx
  on public.daily_questions (destination_id);

create policy "Public insert daily_questions" on public.daily_questions
  for insert
  with check (true);

grant insert on table public.daily_questions to anon, authenticated;
