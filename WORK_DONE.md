# Work Done (as of 2026-01-16)

## Feature: Reddit prompt drafts

### Completed
- Admin can add a Reddit-only LLM prompt when creating a destination.
- Admin can edit and save a prompt per Reddit destination from the list view.
- Prompts support `{{group}}` and `{{url}}` placeholders.
- Tasks page includes a "Reddit post drafts" section to generate and show title + description.
- API route `/api/reddit-prompt` calls an LLM and returns `{ title, description }`.

### Code locations
- Admin UI: `app/admin/page.tsx`
- Intern drafts UI: `app/tasks/page.tsx`
- LLM API route: `app/api/reddit-prompt/route.ts`
- Type updates: `lib/types/schema.ts`

### Required setup (not code)
- Supabase table `posting_destinations` needs a `prompt text` column.
- Set env vars:
  - `LLM_API_KEY` (or `OPENAI_API_KEY`)
  - Optional: `LLM_API_URL` (default `https://api.openai.com/v1/chat/completions`)
  - Optional: `LLM_MODEL` (default `gpt-4.1`)
- Ensure RLS policies allow `select`, `insert`, and `update` on `posting_destinations`.

## Feature: Intern accounts + per-intern tasks

### Completed
- Admin can create intern usernames and passwords.
- /admin uses HTTP Basic Auth (admin/admin).
- Login verifies against interns table and sets a 30-day cookie.
- Daily tasks are generated and stored per intern.
- Manual task creation uses a server API that attaches intern_id.

## Feature: Reddit task completion

### Completed
- Intern can mark each subreddit as Done/Not done for today.
- Completion is stored per intern per destination per IST day.

### Code locations
- Status API: `app/api/reddit-status/route.ts`
- UI toggles: `app/tasks/page.tsx`
- Supabase migration: `supabase/migrations/0010_reddit_task_status.sql`

## Feature: Facebook moderation tasks

### Completed
- Intern sees Facebook groups with step-by-step moderation instructions.
- Per-group completion tracking for the current IST day.

### Code locations
- Status API: `app/api/facebook-status/route.ts`
- UI section: `app/tasks/page.tsx`
- Supabase migration: `supabase/migrations/0011_facebook_task_status.sql`

### Code locations
- Intern admin UI: `app/admin/page.tsx`
- Login API: `app/api/login/route.ts`
- Interns API: `app/api/interns/route.ts`
- Task create API: `app/api/tasks/route.ts`
- Daily tasks API: `app/api/daily-tasks/route.ts`
- Auth helpers: `lib/auth.ts`
- Supabase migration: `supabase/migrations/0008_interns_and_task_mapping.sql`
