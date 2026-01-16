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
- Multi-user role management beyond a single shared login.

## 4. Users
- **Admin**: maintains destinations and Reddit prompts.
- **Intern**: reviews daily tasks, adds manual tasks, uses Reddit draft helper.

## 5. Authentication (Simple Shared Login)
- Single shared username/password stored in env vars.
- Login sets an HTTP-only cookie and gates /tasks, /admin, and LLM APIs.
- No user accounts or profiles.

## 6. Core Entities
### 6.1 Posting Destination
Represents a posting target (Reddit, Facebook, YouTube, Other).
Fields: platform, name, optional URL, optional Reddit prompt.

### 6.2 Task
A single freeform task line shown on /tasks.
Fields: title, created_at.

## 7. Admin Panel (/admin)
- Add destinations with platform, name, optional URL.
- Reddit destinations include a prompt with placeholders: `{{group}}` and `{{url}}`.
- Admin can edit and save Reddit prompts for each destination.

## 8. Intern Tasks Page (/tasks)
- Shows today's tasks (most recent first).
- Allows manual task entry (freeform text).
- Shows Reddit destinations and allows draft generation per destination.

## 9. Daily Task Generation Rules (LLM)
Deterministic, simple, and only triggered once per IST day.

1. When an intern visits /tasks, the UI calls `POST /api/daily-tasks`.
2. Server checks for tasks created today (IST date boundaries).
3. If tasks exist, return them unchanged.
4. If no tasks exist:
   - Read all posting destinations.
   - If no destinations, return an empty list.
   - Otherwise, call the LLM to generate **exactly one task per destination**.
5. Insert the generated tasks into `tasks` and return the list.

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

### 10.2 Manual Task
- Non-empty task text.
- Should include platform + destination name for clarity.
- If an asset is missing, the task explicitly mentions it (e.g., "asset missing").

### 10.3 Reddit Draft
- Destination has a non-empty prompt.
- Prompt renders placeholders for `{{group}}` and optional `{{url}}`.
- Response includes `title` and `description` only.

## 11. Error & Edge Cases
- **Missing prompt**: Draft button disabled and "Prompt missing" is shown.
- **Empty task text**: Not saved.
- **No tasks yet**: Show empty state message.
- **No destinations**: Daily generation returns empty list.
- **RLS blocks access**: Show Supabase error and guidance.
- **LLM error**: Show error message; no data loss.
- **Network error**: Show "Network error" message.
- **Private group or missing URL**: Allowed; use name only.
- **Duplicate tasks**: Allowed; no de-duplication.
- **First visit today**: Generation happens once per IST day only.
- **Unauthorized**: Redirect to /login or return 401 on API.

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

### 13.3 Daily Tasks
- `POST /api/daily-tasks`
- Response: `{ tasks: Task[], generated: boolean }`
- Errors: `500 { error }`, `401` if unauthorized

### 13.4 Reddit Draft
- `POST /api/reddit-prompt`
- Body: `{ prompt, destination: { name, url? } }`
- Response: `{ title, description }`
- Errors: `400` missing fields, `500` LLM failure, `401` if unauthorized

## 14. Success Criteria
- Intern sees a daily list without asking for instructions.
- Admin can update destinations/prompts without developer help.
- Daily list generates once per day and is stable thereafter.
- Reddit drafts are consistent and usable with minimal edits.

## 15. Implementation Status (as of 2026-01-16)
- [x] Admin destination management
- [x] Reddit prompt storage + draft generation
- [x] Intern task list + manual task entry
- [x] Daily LLM task generation on first visit (UTC day)
- [x] Simple shared login gate
- [x] Supabase schema + policies for tasks/destinations
- [ ] Task completion tracking (explicitly out of scope)
- [ ] Auto-posting/scheduling (future)
