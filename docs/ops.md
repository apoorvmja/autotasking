# Ops and Troubleshooting

## Common issues
- **Supabase env missing**: App throws "Missing Supabase environment variables." on startup.
- **RLS blocked**: Admin UI shows row-level security errors; check policies in migrations.
- **LLM errors**: `/api/daily-tasks` or `/api/reddit-prompt` fails due to missing API key or provider errors.
- **YouTube uploads fail**: Missing storage bucket or policies.
- **401 Unauthorized**: Missing admin Basic Auth or intern cookie.

## Quick checks
- Confirm `.env.local` values are set and loaded.
- Verify Supabase tables exist and RLS policies match migrations.
- Ensure `youtube-video-storage-bucket` exists and storage policies are applied.
- Confirm server time does not affect IST date logic (IST bounds are computed server-side).

## Logs
- Next.js server logs for API failures.
- Supabase dashboard logs for policy violations or storage errors.

## Security notes
- Intern passwords are stored in plaintext; consider hashing before production use.
- Admin credentials are hard-coded; update before production use.
