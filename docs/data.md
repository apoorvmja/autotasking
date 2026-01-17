# Data Model (Supabase)

This app currently uses the tables below. They are created by migrations `0001_init.sql`, `0007_add_prompt_and_update_policy.sql`, `0008_interns_and_task_mapping.sql`, `0009_interns_policies.sql`, `0010_reddit_task_status.sql`, `0011_facebook_task_status.sql`, `0012_youtube_videos.sql`, and `0014_youtube_task_status.sql`.

## Tables in use

### posting_destinations
- `id` uuid pk
- `platform` text (Reddit | Facebook | YouTube | Other)
- `name` text
- `url` text nullable
- `prompt` text nullable (Reddit only)
- `created_at` timestamptz

### interns
- `id` uuid pk
- `username` text unique
- `password` text (stored in plaintext)
- `created_at` timestamptz

### tasks
- `id` uuid pk
- `title` text
- `intern_id` uuid -> interns.id
- `created_at` timestamptz

### reddit_task_status
- `id` uuid pk
- `intern_id` uuid -> interns.id
- `destination_id` uuid -> posting_destinations.id
- `task_date` date (IST date string)
- `completed` boolean
- `completed_at` timestamptz nullable
- `created_at` timestamptz
- unique `(intern_id, destination_id, task_date)`

### facebook_task_status
Same shape as `reddit_task_status`.

### youtube_videos
- `id` uuid pk
- `destination_id` uuid -> posting_destinations.id
- `title` text
- `description` text
- `file_path` text (Supabase storage object path)
- `created_at` timestamptz

### youtube_task_status
- `id` uuid pk
- `intern_id` uuid -> interns.id
- `video_id` uuid -> youtube_videos.id
- `task_date` date (IST date string)
- `completed` boolean
- `completed_at` timestamptz nullable
- `created_at` timestamptz
- unique `(intern_id, video_id, task_date)`

## Storage
- Bucket: `youtube-video-storage-bucket`
- Object paths: `youtube/{destinationId}/{timestamp}_{originalName}`
- Signed URLs are generated for downloads in `/api/youtube-videos`.

## Notes on legacy content engine
Older migrations (0002-0006) create and then drop a set of content engine tables. After running `0006_cleanup_content_engine.sql`, those tables no longer exist and are not referenced by app code.
