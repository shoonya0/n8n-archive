# Progress

_Last updated: 2026-11-18_

## Status at a glance

| Area | State |
|---|---|
| Dockerised n8n 2.46.3 + deploy script | ✅ done (`19452e6`) |
| Unit test rules for workflow JSON | ✅ done, 9/9 pass |
| `hello-webhook` (reference workflow) | ✅ done, 3/3 integration tests pass. Merged into `main` (PR #1) |
| `_docs/` (this folder) | ✅ merged into `main` (PR #2) |
| CI (GitHub Actions) | ⬜ not started |
| Pushed to GitHub | ✅ `main` pushed; `origin` is **private**; PRs squash-merged |
| First real project | ⬜ not chosen; see [backlog.md](backlog.md) |

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

## Last verified (2026-11-18)

```
npm test                  → 9 pass, 0 fail
npm run test:integration  → 3 pass, 0 fail   (n8n container healthy)
```

## Next

1. Add CI: GitHub Actions running `npm test` on push and PR.
2. Pick the first project from [backlog.md](backlog.md) and start with
   `superpowers:brainstorming`.

## Open decisions

- Which track first: money (A), reach-out copilot (B) or developer/job-hunt (C)?
- Repo made **private** (2026-11-18), so `_docs/research/` (personal plans) can stay in
  git. If it ever goes public again, remove or gitignore `research/` first.
- Reach-out copilot decisions: see backlog, Track B.
