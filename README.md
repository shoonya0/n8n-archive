# n8n workflows

n8n workflows kept as code, run locally in Docker, verified with tests.

## Quick start
```bash
cp .env.example .env   # set N8N_ENCRYPTION_KEY
npm run n8n:up         # http://localhost:5678
npm run n8n:deploy     # import + publish workflows/
npm run test:all       # unit + integration tests
```

Requires Docker and Node.js 22+. No npm dependencies (tests use `node:test`).

See [CLAUDE.md](CLAUDE.md) for the TDD workflow and conventions.
