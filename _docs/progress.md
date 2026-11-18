# Progress

_Last updated: 2026-11-18_

## Status at a glance

| Area | State |
|---|---|
| Dockerised n8n 2.46.3 + deploy script | ✅ done (`19452e6`) |
| Unit test rules for workflow JSON | ✅ done, 9/9 pass |
| `hello-webhook` (reference workflow) | ✅ done, 3/3 integration tests pass. On `feature/hello-webhook`, **not merged into `main`** |
| `_docs/` (this folder) | 🟡 on `docs/project-docs`, branched from `feature/hello-webhook` |
| CI (GitHub Actions) | ⬜ not started |
| Pushed to GitHub | ⬜ nothing pushed; `origin` is **public** and empty |
| First real project | ⬜ not chosen; see [backlog.md](backlog.md) |

## Done

- **2026-11-03** `19452e6` chore: scaffold the dockerised n8n workflows-as-code repo
  (compose, deploy script, CLAUDE.md, README).
- **2026-11-03** `df0cd17` feat(workflows): hello webhook. `POST /webhook/hello`
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

1. Merge `feature/hello-webhook`, then `docs/project-docs`, into `main` and push (first push
   to the public repo; check the research files are OK to publish).
2. Add CI: GitHub Actions running `npm test` on push and PR.
3. Pick the first project from [backlog.md](backlog.md) and start with
   `superpowers:brainstorming`.

## Open decisions

- Which track first: money (A), reach-out copilot (B) or developer/job-hunt (C)?
- Is it OK for `_docs/research/` to be public? It includes personal plans (job hunt, the
  reach-out copilot). If not, gitignore it or make the repo private.
- Reach-out copilot decisions: see backlog, Track B.
