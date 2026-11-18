# Repo overview

n8n workflows kept **as code**: each workflow is a JSON file in git, deployed into a local
Docker n8n by a script, and verified by tests. There are no npm dependencies; tests use
Node's built-in `node:test`.

## Layout

```
workflows/*.json            one workflow per file, fixed 16-char "id" (re-deploy overwrites)
tests/unit/                 static checks on workflow JSON, no Docker needed   (npm test)
tests/integration/          real HTTP calls to webhooks on the dockerised n8n  (npm run test:integration)
scripts/deploy.mjs          import + publish workflows into the container, restart n8n
docker-compose.yml          n8n pinned to N8N_VERSION (default 2.46.3), data in volume n8n_data
.env.example                copy to .env, set N8N_ENCRYPTION_KEY (.env is gitignored)
.claude/settings.json       enables the superpowers plugin for this project
CLAUDE.md                   rules for Claude Code working in this repo
_docs/                      this folder: overview, progress, backlog, specs, plans, research
```

## Requirements

Docker, and Node.js 22 or newer.

## Commands

| Command | What it does |
|---|---|
| `npm run n8n:up` | Start n8n at http://localhost:5678 and wait until it's healthy |
| `npm run n8n:deploy` | Import and publish **all** `workflows/*.json`, then restart n8n |
| `node scripts/deploy.mjs foo.json` | Deploy only the named workflow(s) |
| `npm test` | Unit tests: workflow JSON structure |
| `npm run test:integration` | Integration tests: needs `n8n:up` + `n8n:deploy` first |
| `npm run test:all` | Both |
| `npm run n8n:logs` | Follow n8n logs |
| `npm run n8n:down` | Stop n8n (data stays in the `n8n_data` volume) |

## How deploy works

`scripts/deploy.mjs` runs `n8n import:workflow` for each file (the `workflows/` folder is
mounted read-only at `/workflows` in the container). It then runs `n8n publish:workflow
--id=<id>` and restarts the container, because n8n 2.x only registers production webhooks
(`/webhook/<path>`) for **published** workflows after startup. The fixed `id` in each JSON
file makes a re-deploy overwrite the workflow instead of creating a copy.

## What the unit tests enforce (`tests/unit/workflows.test.mjs`)

For every workflow file:
- `id` is 16 alphanumeric chars; it has `name`, `nodes` and `connections`
- node names are unique; every node has `type`, `typeVersion` and `position`
- connections only point at existing nodes
- exactly **one trigger** node (a `*Trigger` type or a webhook)
- webhook nodes have `parameters.path` and a `webhookId`
- no hard-coded secrets (regex on `api_key`, `password`, `token` and similar)

Across all workflows, webhook `METHOD path` pairs must be unique.

## Integration tests

One file per workflow, `tests/integration/<name>.test.mjs`, calls
`${N8N_BASE_URL:-http://localhost:5678}/webhook/<path>` and asserts the status code and JSON
body. They run one file at a time (`--test-concurrency=1`). Webhook nodes must use
`responseMode: responseNode` or `lastNode` so a test can assert the response.

## Rules

- Never put secrets in workflow JSON. Use n8n credentials or `$env`.
- Webhook paths are unique across workflows.
- If you edit a workflow in the n8n UI, export it back to the repo:
  `docker exec n8n n8n export:workflow --id=<id> --pretty --output=/tmp/w.json` then
  `docker cp n8n:/tmp/w.json workflows/<name>.json`.
- Tests should not need real API keys. Give workflows that call outside services a
  `$env.DRY_RUN` switch or a fake endpoint (suggested in the research, not built yet).

## n8n 2.x gotchas (from research, see `research/reach-out-copilot.md`)

- File nodes can only read and write `~/.n8n-files` (`/home/node/.n8n-files` in the
  container). Mount data folders there.
- The Code node can't read `$env` by default, and Execute Command is disabled.
- Telegram triggers need a public HTTPS URL. Locally, poll on a schedule instead.
- Everything stops when the PC is off. Real clients need a VPS or n8n Cloud with HTTPS.

## Git conventions

Branch per feature (`feature/`, `fix/`, `docs/`, `chore/`), Conventional Commits, never
commit on `main`. The GitHub remote is `origin` (github.com/shoonya0/n8n, **private**),
with `main` pushed and work merged through squash PRs.
