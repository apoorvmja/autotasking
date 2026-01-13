alter table public.posting_destinations
  add column if not exists content_type text not null default 'question';

alter table public.posting_destinations
  drop constraint if exists posting_destinations_content_type_check;

alter table public.posting_destinations
  add constraint posting_destinations_content_type_check
  check (content_type in ('question', 'university', 'cost'));

create index if not exists posting_destinations_content_type_idx
  on public.posting_destinations (content_type);
