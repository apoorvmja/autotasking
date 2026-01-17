# Decisions

Lightweight architecture decision record (ADR) log.

## 2026-01-17 - Use IST date boundaries for daily tasks
- **Decision**: Daily tasks and completion status are keyed by IST (UTC+05:30) date boundaries.
- **Why**: Intern workflows operate on IST day cycles.
- **Where**: `app/api/daily-tasks/route.ts`, `app/api/*-status/route.ts`, `app/api/admin-summary/route.ts`.

## 2026-01-17 - Use Basic Auth for admin
- **Decision**: Admin routes require HTTP Basic Auth with a static credential.
- **Why**: Simple, no external auth provider required.
- **Tradeoff**: Credentials are hard-coded and should be replaced for production.

## 2026-01-17 - Use Supabase for all persistence
- **Decision**: All data and file storage live in Supabase.
- **Why**: Single managed backend for DB + storage + policy control.

## Template
- Date:
- Decision:
- Reason:
- Consequences:
- References:
