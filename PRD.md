# Intern Daily Task System PRD

## 1. Overview
A lightweight, intern-focused system to list and execute daily posting tasks across platforms. Admins maintain a list of posting destinations and (for Reddit only) a prompt that can generate a draft. Interns visit /tasks to see the daily checklist, add manual tasks, and generate Reddit drafts. On the first visit each day, the system generates a deterministic daily task list via LLM (one task per destination) and stores it.

## 2. Goals
- Provide interns a single, clear daily task list.
- Keep destinations editable by admins without developer help.
- Generate consistent Reddit drafts using saved prompts.
- Auto-generate the daily checklist once per day when interns first open /tasks.

## 3. Non-Goals
- Auto-posting or scheduling on any platform.
- Task completion workflows (checkboxes, statuses, approvals).
- Analytics, performance tracking, or audit logs.
- Advanced role management beyond admin-managed intern logins.

## 4. Users
- **Admin**: maintains destinations and Reddit prompts.
- **Intern**: reviews daily tasks, adds manual tasks, uses Reddit draft helper.

## 5. Authentication (Admin Basic Auth + Intern Logins)
- /admin is protected by HTTP Basic Auth (username: admin, password: admin).
- Admin creates intern usernames and passwords in /admin.
- Intern login sets an HTTP-only cookie (30 days) and gates /tasks and intern APIs.
- Each intern has their own task list mapped to their account.

## 6. Core Entities
### 6.1 Posting Destination
Represents a posting target (Reddit, Facebook, YouTube, Other).
Fields: platform, name, optional URL, optional Reddit prompt.

### 6.2 Task
A single freeform task line shown on /tasks.
Fields: title, created_at, intern_id.

### 6.3 Intern
Login identity for interns.
Fields: username, password, created_at.

## 7. Admin Panel (/admin)
- Add destinations with platform, name, optional URL.
- Reddit destinations include a prompt with placeholders: `{{group}}` and `{{url}}`.
- Admin can edit and save Reddit prompts for each destination.
- Admin can create intern usernames and passwords.
- Admin can upload daily YouTube videos with title + description.
- Admin can view daily per-intern progress (done/pending totals).

## 8. Intern Tasks Page (/tasks)
- Shows Reddit drafts as the daily work list.
- Drafts are generated automatically and displayed (no button).
- Daily checklist + assigned tasks UI is removed.
- Intern can mark each subreddit task as Done/Not done for today.
- Facebook moderation tasks are listed with the same Done/Not done tracking.
- YouTube uploads are listed with a download button and channel link.
- YouTube uploads can be marked Done/Not done for today.

## 9. Daily Task Generation Rules (LLM)
Deterministic, simple, and only triggered once per IST day. (Currently not shown in UI.)

1. When an intern visits /tasks, the UI calls `POST /api/daily-tasks`.
2. Server checks for tasks created today for that intern (IST date boundaries).
3. If tasks exist, return them unchanged.
4. If no tasks exist:
   - Read all posting destinations.
   - If no destinations, return an empty list.
   - Otherwise, call the LLM to generate **exactly one task per destination**.
5. Insert the generated tasks into `tasks` with the intern_id and return the list.

LLM formatting rules:
- Each task is a single line (8-14 words).
- Starts with an action verb.
- Mentions the platform and destination name.
- No extra commentary or markdown.

## 10. Task Acceptance Criteria
### 10.1 Generated Daily Task
- One task exists per destination.
- Includes platform name + destination name.
- Starts with an action verb.
- 8-14 words, plain text.

### 10.2 Manual Task (Not used in UI)
- Non-empty task text.
- Should include platform + destination name for clarity.
- If an asset is missing, the task explicitly mentions it (e.g., "asset missing").

### 10.3 Reddit Draft (Auto-generated in UI)
- Destination has a non-empty prompt.
- Prompt renders placeholders for `{{group}}` and optional `{{url}}`.
- Response includes `title` and `description` only.

### 10.4 Reddit Task Completion
- Each subreddit can be marked Done or Not done for the current IST date.
- Completion is stored per intern, per destination, per day.

### 10.5 Facebook Moderation Task
- Intern opens group, sorts by newest, reviews top 5 posts, removes spam comments.
- Each group can be marked Done/Not done for the current IST date.

### 10.6 YouTube Upload Task
- Admin uploads a video with title + description for a specific channel.
- Intern downloads the video and uploads it to the channel with the provided title/description.
- Intern marks the upload as Done/Not done.

## 11. Error & Edge Cases
- **Missing prompt**: "Prompt missing" is shown for that subreddit.
- **No destinations**: Draft section shows empty state.
- **RLS blocks access**: Show Supabase error and guidance.
- **LLM error**: Show error message; no data loss.
- **Network error**: Show "Network error" message.
- **Private group or missing URL**: Allowed; use name only.
- **Unauthorized (intern)**: Redirect to /login or return 401 on API.
- **Unauthorized (admin)**: Basic auth challenge on /admin.

## 12. Data Model (Supabase)
### 12.1 Table: `posting_destinations`
- `id` uuid primary key
- `platform` text (Reddit | Facebook | YouTube | Other)
- `name` text
- `url` text, nullable
- `prompt` text, nullable (Reddit only)
- `created_at` timestamptz default now()

RLS policies (minimum required):
- select/insert/update allowed for posting_destinations

### 12.2 Table: `tasks`
- `id` uuid primary key
- `title` text
- `intern_id` uuid references interns(id)
- `created_at` timestamptz default now()

RLS policies (minimum required):
- select/insert allowed for tasks

## 13. API Contracts (No Code)
### 13.1 Login
- `POST /api/login`
- Body: `{ username, password }`
- Response: `200 { ok: true }` or `401 { error }`

### 13.2 Logout
- `POST /api/logout`
- Response: `200 { ok: true }`

### 13.3 Admin Summary
- `GET /api/admin-summary`
- Response: `{ date, interns: [{ username, reddit, facebook, youtube, overall }] }`

### 13.4 Interns (Admin)
- `GET /api/interns`
- Response: `{ interns: [{ id, username, created_at }] }`
- `POST /api/interns`
- Body: `{ username, password }`
- Response: `200 { ok: true }` or `400/500 { error }`

### 13.5 Daily Tasks
- `POST /api/daily-tasks`
- Response: `{ tasks: Task[], generated: boolean }`
- Errors: `500 { error }`, `401` if unauthorized

### 13.6 Task Create
- `POST /api/tasks`
- Body: `{ title }`
- Response: `200 { ok: true }` or `400/500 { error }`

### 13.7 Reddit Draft
- `POST /api/reddit-prompt`
- Body: `{ prompt, destination: { name, url? } }`
- Response: `{ title, description }`
- Errors: `400` missing fields, `500` LLM failure, `401` if unauthorized

### 13.8 Reddit Status
- `GET /api/reddit-status`
- Response: `{ items: [{ destination_id, completed }] }`
- `POST /api/reddit-status`
- Body: `{ destinationId, completed }`
- Response: `{ ok: true, completed }`

### 13.9 Facebook Status
- `GET /api/facebook-status`
- Response: `{ items: [{ destination_id, completed }] }`
- `POST /api/facebook-status`
- Body: `{ destinationId, completed }`
- Response: `{ ok: true, completed }`

### 13.10 YouTube Videos
- `GET /api/youtube-videos`
- Response: `{ videos: [{ id, destination_id, title, description, download_url }] }`
- `POST /api/youtube-videos` (multipart)
- Body: `destinationId`, `title`, `description`, `file`
- `DELETE /api/youtube-videos?id=...`

### 13.11 YouTube Status
- `GET /api/youtube-status`
- Response: `{ items: [{ video_id, completed }] }`
- `POST /api/youtube-status`
- Body: `{ videoId, completed }`
- Response: `{ ok: true, completed }`

## 14. Success Criteria
- Intern sees Reddit drafts without asking for instructions.
- Intern sees Facebook moderation tasks without asking for instructions.
- Intern can download YouTube videos and upload them to the right channel.
- Admin can update destinations/prompts without developer help.
- Drafts generate automatically on page load.
- Reddit drafts are consistent and usable with minimal edits.

## 15. Implementation Status (as of 2026-01-16)
- [x] Admin destination management
- [x] Reddit prompt storage + draft generation UI (auto-run)
- [x] Reddit drafts as the daily work list
- [ ] Daily task list UI (removed)
- [x] Admin-managed intern logins
- [x] Supabase schema + policies for tasks/destinations
- [x] Reddit task completion tracking (per day)
- [x] Facebook moderation tracking (per day)
- [x] YouTube video uploads for interns
- [x] YouTube completion tracking (per day)
- [x] Admin daily progress summary
- [ ] Auto-posting/scheduling (future)
### 12.3 Table: `interns`
- `id` uuid primary key
- `username` text (unique)
- `password` text
- `created_at` timestamptz default now()

### 12.4 Table: `reddit_task_status`
- `id` uuid primary key
- `intern_id` uuid references interns(id)
- `destination_id` uuid references posting_destinations(id)
- `task_date` date (IST day)
- `completed` boolean
- `completed_at` timestamptz nullable
- `created_at` timestamptz default now()

### 12.5 Table: `facebook_task_status`
- `id` uuid primary key
- `intern_id` uuid references interns(id)
- `destination_id` uuid references posting_destinations(id)
- `task_date` date (IST day)
- `completed` boolean
- `completed_at` timestamptz nullable
- `created_at` timestamptz default now()

### 12.6 Table: `youtube_videos`
- `id` uuid primary key
- `destination_id` uuid references posting_destinations(id)
- `title` text
- `description` text
- `file_path` text
- `created_at` timestamptz default now()

### 12.7 Table: `youtube_task_status`
- `id` uuid primary key
- `intern_id` uuid references interns(id)
- `video_id` uuid references youtube_videos(id)
- `task_date` date (IST day)
- `completed` boolean
- `completed_at` timestamptz nullable
- `created_at` timestamptz default now()
