# Overview

Autotasking is a lightweight intern task tracker for daily social posting and moderation work. Admins configure posting destinations and intern accounts. Interns sign in to see daily tasks, Reddit draft helpers, Facebook moderation checklists, and YouTube upload tasks.

## Roles
- Admin: manages destinations, intern credentials, Reddit prompts, YouTube uploads, and daily completion summary.
- Intern: signs in to view tasks and mark completion.

## Core flows
- Admin creates posting destinations (Reddit, Facebook, YouTube, Other) in `/admin`.
- Admin creates intern accounts in `/admin`.
- Intern logs in via `/login`; auth is stored in an HTTP-only cookie.
- Visiting `/tasks` loads:
  - Reddit destinations + draft generation via LLM.
  - Facebook destinations + moderation checklist + status.
  - YouTube uploads + download links + status.
- Daily tasks are generated once per IST day via LLM when an intern first hits `/tasks`.

## Key pages
- `/` Landing page.
- `/login` Intern login.
- `/tasks` Intern work dashboard.
- `/admin` Admin dashboard (Basic Auth required).
- `/admin/dashbord` Alias to `/admin` (typo in route name).

## Key services
- Supabase database + storage bucket for YouTube uploads.
- LLM API for daily task generation and Reddit drafts.

## Time zone
Daily task and completion tracking is based on IST (UTC+05:30) date boundaries.
