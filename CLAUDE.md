# n8n workflows as code

n8n workflows live as JSON in `workflows/`, run in Docker, and are verified with tests.

## Layout
- `workflows/*.json` — one workflow per file, each with a fixed `id` (re-deploys overwrite it).
- `tests/unit/` — static checks on workflow JSON (no Docker needed). `npm test`
- `tests/integration/` — call real webhooks on the dockerised n8n. `npm run test:integration`
- `scripts/deploy.mjs` — import + publish workflows into the container, restart n8n.
- `docker-compose.yml` — n8n pinned to a version (`N8N_VERSION`); data in volume `n8n_data`.

## Commands
```
npm run n8n:up            # start n8n at http://localhost:5678 (waits for healthy)
npm run n8n:deploy        # import + publish all workflows, restart n8n
npm test                  # unit: workflow JSON is well-formed
npm run test:integration  # integration: requires n8n:up + n8n:deploy
npm run n8n:down
```

## Workflow (TDD, superpowers)
Use the superpowers skills: brainstorming → writing-plans → test-driven-development →
verification-before-completion. For every new or changed workflow:
1. **Red:** write the integration test for the webhook's contract (request → expected
   response) in `tests/integration/<name>.test.mjs`. Run it and watch it fail.
2. **Green:** build/edit `workflows/<name>.json` (with the n8n skills/MCP for node
   config), `npm run n8n:deploy`, re-run until it passes.
3. `npm test` must pass (structure rules in `tests/unit/workflows.test.mjs`).
4. If you edited the workflow in the n8n UI, export it back to the repo:
   `docker exec n8n n8n export:workflow --id=<id> --pretty --output=/tmp/w.json`
   then `docker cp n8n:/tmp/w.json workflows/<name>.json`.

## Rules
- Never put secrets in workflow JSON; use n8n credentials or `$env`.
- Webhook paths are unique across workflows; webhook nodes use `responseMode: responseNode`
  or `lastNode` so tests can assert the response.
- n8n v2: workflows must be **published** for production webhooks (`/webhook/<path>`).
