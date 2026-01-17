# API Reference

Auth notes:
- Admin endpoints use HTTP Basic Auth (`admin:admin`).
- Intern endpoints require `AUTH_COOKIE` set via `/api/login`.

## Auth
### POST /api/login
Body:
```json
{ "username": "...", "password": "..." }
```
Responses:
- 200 `{ "ok": true }`
- 400/401 `{ "error": "..." }`

### POST /api/logout
Response:
- 200 `{ "ok": true }`

## Admin
### GET /api/interns
Response:
```json
{ "interns": [{ "id": "...", "username": "...", "created_at": "..." }] }
```

### POST /api/interns
Body:
```json
{ "username": "...", "password": "..." }
```
Response:
- 200 `{ "ok": true }`

### GET /api/admin-summary
Response:
```json
{
  "date": "YYYY-MM-DD",
  "totals": { "reddit": 0, "facebook": 0, "youtube": 0 },
  "interns": [
    {
      "id": "...",
      "username": "...",
      "reddit": { "done": 0, "total": 0, "pending": 0 },
      "facebook": { "done": 0, "total": 0, "pending": 0 },
      "youtube": { "done": 0, "total": 0, "pending": 0 },
      "overall": { "done": 0, "total": 0, "pending": 0 }
    }
  ]
}
```

## Intern task generation
### POST /api/daily-tasks
- Creates daily tasks once per IST day if none exist for the intern.
Response:
```json
{ "tasks": [{ "id": "...", "title": "...", "created_at": "..." }], "generated": true }
```
Errors: 401/500

### POST /api/tasks
Body:
```json
{ "title": "..." }
```
Response:
- 200 `{ "ok": true }`

## Reddit drafts
### POST /api/reddit-prompt
Body:
```json
{ "prompt": "...", "destination": { "name": "...", "url": "..." } }
```
Response:
```json
{ "title": "...", "description": "..." }
```

## Status endpoints (IST date)
### GET /api/reddit-status
Response:
```json
{ "items": [{ "destination_id": "...", "completed": true }] }
```

### POST /api/reddit-status
Body:
```json
{ "destinationId": "...", "completed": true }
```
Response:
```json
{ "ok": true, "completed": true }
```

### GET /api/facebook-status
Same shape as reddit-status.

### POST /api/facebook-status
Same shape as reddit-status.

### GET /api/youtube-status
Response:
```json
{ "items": [{ "video_id": "...", "completed": true }] }
```

### POST /api/youtube-status
Body:
```json
{ "videoId": "...", "completed": true }
```
Response:
```json
{ "ok": true, "completed": true }
```

## YouTube videos
### GET /api/youtube-videos
Auth: admin or intern.
Response:
```json
{
  "videos": [
    {
      "id": "...",
      "destination_id": "...",
      "title": "...",
      "description": "...",
      "file_path": "...",
      "created_at": "...",
      "download_url": "..."
    }
  ]
}
```

### POST /api/youtube-videos
Auth: admin or intern.
Multipart form fields: `destinationId`, `title`, `description`, `file`.
Response:
- 200 `{ "ok": true }`

### DELETE /api/youtube-videos?id=...
Auth: admin or intern.
Response:
- 200 `{ "ok": true }`
