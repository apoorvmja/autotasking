# Architecture

## Stack
- Next.js App Router
- React 19
- Supabase (Postgres + storage)
- LLM API for task generation and Reddit drafts

## Directory map
- `app/` UI routes and API routes.
  - `app/login/page.tsx` Intern login UI.
  - `app/tasks/page.tsx` Intern tasks dashboard.
  - `app/admin/page.tsx` Admin dashboard.
  - `app/api/*` JSON/HTTP endpoints.
- `lib/` shared logic.
  - `lib/auth.ts` Auth cookie helpers.
  - `lib/supabase/*` Client/server Supabase SDKs.
  - `lib/types/schema.ts` Shared TS types.
- `supabase/migrations/` SQL schema migrations.
- `middleware.ts` Route protection and Basic Auth.

## Auth model
- **Admin**: HTTP Basic Auth (`admin:admin`) checked in `middleware.ts` and some API routes.
- **Interns**: Login via `/api/login` sets a base64 JSON cookie (`AUTH_COOKIE`).
- `middleware.ts` gates `/tasks` and most `/api/*` routes for interns, and `/admin` for admin.

## Data flow (high level)
1. Admin uses `/admin` to create destinations and intern accounts.
2. Intern logs in and hits `/tasks`.
3. `/api/daily-tasks` generates tasks once per IST day if none exist for the intern.
4. `/tasks` reads destinations and task status tables to render Reddit/Facebook/YouTube sections.
5. Status toggles write to `*_task_status` tables with IST date keys.
6. YouTube uploads are stored in Supabase storage; metadata in `youtube_videos`.

## Time boundaries
Daily generation and completion are based on IST (UTC+05:30) server-side calculations.
