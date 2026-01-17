# Setup

## Prerequisites
- Node.js and npm installed.
- A Supabase project (database + storage).

## Install
```bash
npm install
```

## Environment variables
Create `.env.local` in the repo root:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Server-side intern auth + admin management
SUPABASE_SERVICE_ROLE_KEY=...

# LLM configuration (daily tasks + Reddit drafts)
LLM_API_KEY=... # or OPENAI_API_KEY
LLM_API_URL=https://api.openai.com/v1/chat/completions
LLM_MODEL=gpt-4.1
```

Notes:
- Server code will use `SUPABASE_SERVICE_ROLE_KEY` if set, otherwise it falls back to `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- The admin panel is protected by HTTP Basic Auth with `admin:admin` (see `middleware.ts`).

## Supabase schema
Run the SQL migrations in `supabase/migrations` in order against your Supabase database.

Required storage:
- Create a bucket named `youtube-video-storage-bucket`.
- Apply the storage policies from `supabase/migrations/0013_storage_policies_youtube.sql`.

## Run locally
```bash
npm run dev
```
Open `http://localhost:3000`.
