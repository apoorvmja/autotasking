alter table public.posting_destinations
  add column if not exists prompt text;

create policy "Public update posting destinations" on public.posting_destinations
  for update
  using (true)
  with check (true);

grant update on table public.posting_destinations to anon, authenticated;
