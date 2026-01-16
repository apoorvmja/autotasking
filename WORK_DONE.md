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
