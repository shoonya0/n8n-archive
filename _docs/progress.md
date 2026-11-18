# Progress

_Last updated: 2026-11-18_

## Status at a glance

| Area | State |
|---|---|
| Dockerised n8n 2.46.3 + deploy script | ✅ done (`19452e6`) |
| Unit tests (structure rules + Code-node logic) | ✅ 37/37 pass |
| `hello-webhook` (reference workflow) | ✅ done, 3/3 integration tests pass. Merged into `main` (PR #1) |
| `_docs/` (this folder) | ✅ merged into `main` (PR #2) |
| CI (GitHub Actions) | ✅ `.github/workflows/ci.yml`: unit + integration (n8n in Docker) on every PR and push to `main` |
| Pushed to GitHub | ✅ `main` pushed; `origin` is **private**. ⚠️ PRs #4, #5 and #6 were squash-merged (`81da457`, `2d7e229`, `c8c2a93`) and PR #7 got a merge commit (`df7e312`): those show the profile name, not `shoonya0`. Only rebase-merge keeps `shoonya0` (PRs #3 and #8). Squash and merge commits are still enabled in repo settings (checked 2026-11-18) |
| First real project: **J1 Job radar v1** | ✅ merged into `main` (PR #5, `2d7e229`), CI green. `POST /webhook/jobs/radar`, 11/11 integration tests pass. [Spec](specs/2026-11-18-job-radar-design.md), [plan](plans/2026-11-18-job-radar-plan.md) |

## Done

- **2026-11-03** `19452e6` chore: scaffold the dockerised n8n workflows-as-code repo
  (compose, deploy script, CLAUDE.md, README).
- **2026-11-03** `3865fc3` (PR #1) feat(workflows): hello webhook. `POST /webhook/hello`
  `{name}` returns `{message: "Hello, <name>!"}`; a missing name returns 400. Built without
  the superpowers skills (no spec or plan).
- **2026-11-03 to 2026-11-18** Research: money projects, reach-out copilot (with
  superpowers brainstorming), and backend/job-hunt automations. Now in `research/`.
- **2026-11-18** Added `_docs/`: overview, build process, backlog, progress, and
  `specs/`/`plans/` folders for superpowers output.
- **2026-11-18** Commit authors on `main` rewritten to `shoonya0` (one-time force-push).
  PRs are merged with `gh pr merge --rebase`, never squash (squash uses the profile name).
- **2026-11-18** From now on Claude only opens PRs; the owner reviews and merges them.
- **2026-11-18** CI: GitHub Actions runs `npm test`, then starts n8n in Docker, deploys
  and runs `npm run test:integration`.
- **2026-11-18** Fix: `deploy.mjs` now waits for n8n's "Editor is now accessible" log line
  after restart. `/healthz` is OK ~3s before published webhooks are registered, which made
  CI get 404s.
- **2026-11-18** J1 Job radar v1 (track C chosen): Greenhouse, Lever and Ashby boards →
  normalize, dedup, keyword filter and score → ranked JSON with per-board errors. Tested
  with a `job-fixtures` container (no real API calls in tests). Smoke-tested against live
  GitLab, Spotify and Ramp boards. Lesson: `new URL()` doesn't work in n8n's Code-node
  sandbox, though plain-Node unit tests pass; only the integration test caught it.
- **2026-11-18** PR #5 (job radar) and PR #6 (progress update) merged into `main`.
- **2026-11-18** Fix: the "Editor is now accessible" wait wasn't enough. With two
  workflows, CI run #11 (PR #7) still got 404s on `/webhook/hello`, because n8n logs that
  line before it processes published workflows. `deploy.mjs` now sends a CORS preflight
  (`OPTIONS`) to every deployed webhook until each answers 204. Measured: 204 at the same
  moment a real POST starts working; it doesn't run the workflow. Logic in
  `scripts/lib/readiness.mjs`, unit-tested. Merged as PR #8 (rebase-merged, author `shoonya0`).
- **2026-11-18** PR #7 (progress update) rebased onto PR #8 to fix a `progress.md` conflict,
  then merged. Everything up to here is on `main`; no open PRs.

## Last verified (2026-11-18, on `main` at `df7e312`, after PR #7; CI run #15 green)

```
npm test                  → 41 pass, 0 fail
npm run test:integration  → 14 pass, 0 fail  (hello 3 + job radar 11)
```

## Next

1. **J1 v2**: twice-a-day Schedule trigger workflow that calls the radar with a
   `profile.json` + board list kept in the repo, and sends the top 10 to Telegram (needs a
   bot token as an n8n credential). Remember already-sent jobs so each one is sent only once.
2. **J2 Tracker** (Gmail → application status table), see [backlog.md](backlog.md).

## Open decisions

- **Squash merges keep putting the profile name on `main`.** Fix: GitHub → Settings →
  General → Pull Requests, untick "Allow squash merging" and "Allow merge commits" (Claude's
  attempt was blocked by permissions). Optionally rewrite `81da457`, `2d7e229`, `c8c2a93` and `df7e312` to
  `shoonya0` with one more force-push (needs the owner's OK).
- Track C (developer/job-hunt) chosen first, 2026-11-18. Which real boards and keywords go
  in `profile.json` for J1 v2? (The owner's list of target companies.)
- Repo made **private** (2026-11-18), so `_docs/research/` (personal plans) can stay in
  git. If it ever goes public again, remove or gitignore `research/` first.
- Reach-out copilot decisions: see backlog, Track B.
