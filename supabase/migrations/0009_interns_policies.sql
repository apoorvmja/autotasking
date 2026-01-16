create policy "Public read interns" on public.interns
  for select
  using (true);

create policy "Public insert interns" on public.interns
  for insert
  with check (true);

grant select, insert on table public.interns to anon, authenticated;
