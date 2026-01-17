# Deploy

## Build and run
```bash
npm run build
npm run start
```

## Environment
Make sure all values from `docs/setup.md` are configured in your hosting provider:
- Supabase URL + anon key
- Supabase service role key
- LLM API key + model

## Storage
Ensure the Supabase bucket `youtube-video-storage-bucket` exists and storage policies are applied.

## Admin access
The admin UI uses HTTP Basic Auth with `admin:admin`. Change this in `middleware.ts` and related API checks before production use.
