# J1 Job radar: design (v1)

_2026-11-18. The owner chose "go with the recommendation" and skipped the questions, so every
decision below is **Claude's call** unless it is quoted from the research
(`_docs/research/backend-automation-projects.md`, section J)._

## Why

The owner is job hunting. Checking company career pages by hand is slow and easy to forget.
Greenhouse, Lever and Ashby, three applicant tracking systems (ATS), publish every company's
open jobs through free public APIs that need no key. A radar that pulls those boards and keeps
only the jobs matching the owner's profile turns that into one request.

## v1 scope

An n8n workflow `workflows/job-radar.json`. You send it a list of job boards and a profile,
and it returns the best-matching jobs, ranked.

**In v1:** Greenhouse, Lever and Ashby; keyword scoring; one HTTP request in, JSON out.

**Not in v1 (later versions):** the twice-a-day schedule, `profile.json` stored in the repo,
Telegram delivery, LLM scoring, the HN / Remotive / Adzuna sources, and remembering which
jobs were already seen.

**Anti-goals:** hammering the job APIs (v1 only fetches when called); sending profile or job
data to any third party; a radar that silently drops boards that fail.

## Contract

`POST /webhook/jobs/radar`

```json
{
  "boards": [
    { "ats": "greenhouse", "token": "gitlab" },
    { "ats": "lever", "token": "spotify" },
    { "ats": "ashby", "token": "ramp" }
  ],
  "profile": {
    "titleKeywords": ["backend", "golang", "node"],
    "excludeTitleKeywords": ["manager", "intern"],
    "locations": ["remote", "india"]
  },
  "limit": 10
}
```

| Field | Rule |
|---|---|
| `boards` | required, 1–50 items; `ats` is one of `greenhouse`, `lever`, `ashby`; `token` matches `^[A-Za-z0-9_-]{1,100}$` |
| `profile.titleKeywords` | required, at least one non-empty string |
| `profile.excludeTitleKeywords` | optional, default `[]` |
| `profile.locations` | optional, default `[]` (any location) |
| `limit` | optional integer 1–50, default `10` |
| `apiBase` | optional, **tests only**: must match `^http://job-fixtures(:<port>)?/?$`: scheme, host and optional port only (so `http://job-fixtures:@evil.com` is refused); replaces the real API host |

**200 response:**

```json
{
  "count": 2,
  "jobs": [
    {
      "source": "greenhouse", "board": "acme", "company": "Acme",
      "title": "Senior Backend Engineer (Go)", "location": "Remote, India",
      "url": "https://...", "postedAt": "2026-11-10T09:00:00.000Z",
      "score": 25, "matched": ["backend", "golang", "remote"]
    }
  ],
  "errors": [{ "source": "lever", "board": "missing", "status": 404 }]
}
```

**400 response:** `{"error": "<message>"}`, using exactly one of these messages:
`boards must be a non-empty array of at most 50`, `unsupported ats: <ats>`,
`invalid token: <token>`, `profile.titleKeywords is required`,
`limit must be an integer from 1 to 50`, `apiBase is not allowed`.
Validation stops at the first error, checking fields in that order.

## Behaviour

**Fetch URLs** (base replaced by `apiBase` when set):

| ATS | URL |
|---|---|
| greenhouse | `https://boards-api.greenhouse.io/v1/boards/{token}/jobs` |
| lever | `https://api.lever.co/v0/postings/{token}?mode=json` |
| ashby | `https://api.ashbyhq.com/posting-api/job-board/{token}` |

**Normalization.** Every job becomes `{source, board, company, title, location, url,
postedAt, remote}`. Titles and locations are trimmed. `postedAt` is an ISO UTC string.

| ATS | company | title | location | url | postedAt | remote |
|---|---|---|---|---|---|---|
| greenhouse | `company_name`, else token | `title` | `location.name` | `absolute_url` | `first_published`, else `updated_at` | location contains "remote" |
| lever | token | `text` | `categories.allLocations` joined with " / ", else `categories.location` | `hostedUrl` | `createdAt` (ms) | `workplaceType == "remote"` or location contains "remote" |
| ashby | token | `title` | `location` plus each `secondaryLocations[].location`, joined with " / " | `jobUrl` | `publishedAt` | `isRemote === true` or location contains "remote" |

Ashby jobs with `isListed === false` are skipped.

**Matching** (all case-insensitive substring checks):
1. Drop the job if its title contains any `excludeTitleKeywords` entry.
2. Keep it only if the title contains at least one `titleKeywords` entry.
3. If `locations` isn't empty, keep it only if the location contains one of them. The entry
   `remote` also matches when `remote` is true.

**Score** = 10 × (number of title keywords matched) + 5 if a location matched. `matched` lists
the title keywords that matched, then the location entries, in profile order.

**Dedup:** the key is lowercase `company|title|location`. When two jobs share a key, keep the
one with the newest `postedAt`.

**Order:** by `score` descending, then `postedAt` descending, then `title` ascending. Then
apply `limit`. `count` is the number returned.

**Failures:** a board that returns a status other than 2xx, or fails to connect, adds
`{source, board, status}` to `errors` (status `0` for a connection failure). The other boards
are still returned.

## Testing

- **Unit** (`npm test`): the Code-node logic, extracted from the workflow JSON and run with
  fake `$input`/`$` objects. No Docker needed.
- **Integration** (`npm run test:integration`): real webhook calls. n8n fetches from a
  `job-fixtures` container that serves recorded-shape sample boards, so tests never hit the
  real APIs and give the same result every run.

## Left to the builder

Node layout inside the workflow, fixture contents (they must cover every rule above), and
node positions.
