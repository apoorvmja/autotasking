drop table if exists public.post_queue cascade;
drop table if exists public.daily_questions cascade;
drop table if exists public.university_cards cascade;
drop table if exists public.universities cascade;
drop table if exists public.programs cascade;
drop table if exists public.cost_items cascade;
drop table if exists public.visa_rules cascade;
drop table if exists public.comparison_posts cascade;
drop table if exists public.student_life_posts cascade;
drop table if exists public.real_stories cascade;

alter table public.posting_destinations
  drop constraint if exists posting_destinations_content_type_check;

alter table public.posting_destinations
  drop column if exists content_type;

drop index if exists posting_destinations_content_type_idx;
