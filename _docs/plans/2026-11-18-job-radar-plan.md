# J1 Job radar v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `POST /webhook/jobs/radar` returns ranked, deduplicated jobs from Greenhouse, Lever and Ashby boards that match a keyword profile.

**Architecture:** One n8n workflow: Webhook → Code `Validate Request` → IF `Valid?` → HTTP Request `Fetch Board` (one call per board, full response, never error) → Code `Rank Jobs` → Respond. The Code-node JS lives in the workflow JSON; unit tests extract it and run it with fake `$input`/`$`. Integration tests make n8n fetch from a `job-fixtures` container instead of the real APIs.

**Tech Stack:** n8n 2.46.3 (Docker), Node 22 `node:test`, no npm dependencies.

**Spec:** `_docs/specs/2026-11-18-job-radar-design.md`

## Global Constraints

- No npm dependencies; tests use `node:test` + `node:assert/strict`.
- Workflow `id` is 16 alphanumeric chars; webhook path `jobs/radar`, `responseMode: responseNode`.
- 400 messages are copied verbatim from the spec's list.
- Tests never call the real job APIs.
- `apiBase` accepted only when it starts with `http://job-fixtures:`.

## Review Focus

1. A board whose token has `/` or `..` must give `400 invalid token: <token>`, not a fetch → test in Task 2 (`rejects a token with a slash`).
2. A Lever board returns a top-level **array**. The HTTP node must not split it into items, which would break board↔response pairing (use full response) → covered by the integration ranking test, which includes a Lever board.
3. A fixture/real board responds 404 with a JSON body → reported in `errors` with `status: 404`, others still returned → Task 2 unit + Task 3 integration test.
4. The same job posted twice (same company/title/location) → returned once, newest `postedAt` kept → Task 2 unit test `dedups keeping the newest`.
5. Mixed-case keywords and titles with extra spaces (Ashby's `" Software Engineer"`) → still match and are trimmed → Task 2 unit test `matches case-insensitively and trims`.

---

### Task 1: Job-board fixture server

**Files:**
- Create: `tests/fixtures/job-boards/server.mjs`, `tests/fixtures/job-boards/greenhouse/acme.json`, `tests/fixtures/job-boards/lever/globex.json`, `tests/fixtures/job-boards/ashby/initech.json`
- Modify: `docker-compose.yml` (add the `job-fixtures` service)
- Test: `tests/unit/job-fixtures-server.test.mjs`

**Interfaces:**
- Produces: HTTP server on `PORT` (default 8080) serving `/v1/boards/{t}/jobs` → `greenhouse/{t}.json`, `/v0/postings/{t}` → `lever/{t}.json`, `/posting-api/job-board/{t}` → `ashby/{t}.json`, with `content-type: application/json`; anything else → `404 {"error":"not found"}`. In compose: `http://job-fixtures:8080`.

- [ ] **Step 1:** Write `tests/unit/job-fixtures-server.test.mjs`. It spawns `node tests/fixtures/job-boards/server.mjs` with `PORT=18080` and asserts: the greenhouse path returns 200 with `jobs` an array; `/v0/postings/globex?mode=json` returns a 200 array; `/posting-api/job-board/initech` returns 200 with `jobs`; `/v1/boards/missing/jobs` returns 404.
- [ ] **Step 2:** `npm test` → FAIL (server missing).
- [ ] **Step 3:** Implement the server with `node:http`; tokens limited to `[A-Za-z0-9_-]`. Write the fixtures in the real shapes (see spec normalization table) so they cover: matches, an excluded title, a location miss, a remote-flag-only match, a duplicate pair with different `postedAt`, an unlisted Ashby job, and a padded title.
- [ ] **Step 4:** Add the compose service: `image: node:22-alpine`, `container_name: job-fixtures`, `command: node /srv/server.mjs`, volume `./tests/fixtures/job-boards:/srv:ro`, a wget healthcheck on `http://localhost:8080/v1/boards/acme/jobs`.
- [ ] **Step 5:** `npm test` → PASS; `docker compose up -d --wait` → both containers healthy.
- [ ] **Step 6:** Commit `test(job-radar): add job-board fixture server for integration tests`.

### Task 2: Job radar workflow (TDD)

**Files:**
- Create: `workflows/job-radar.json`, `tests/unit/job-radar.test.mjs`, `tests/integration/job-radar.test.mjs`

**Interfaces:**
- Consumes: `http://job-fixtures:8080` from Task 1.
- Produces: Code node `Validate Request` returns either `[{json:{error}}]` or one item per board `{ats, token, url}`. Code node `Rank Jobs` reads `$input.all()` (HTTP full responses `{statusCode, body}` or `{error}`), `$('Validate Request').all()` and `$('Webhook').first().json.body`, and returns `[{json:{count, jobs, errors}}]`.

- [ ] **Step 1:** Write `tests/integration/job-radar.test.mjs` (with `apiBase: "http://job-fixtures:8080"`): `ranks matches from all three ATS` (deepEqual against the expected list derived from the fixtures), `applies limit`, `reports a missing board and still returns the rest`, plus one 400 test per spec message, including `rejects a token with a slash`.
- [ ] **Step 2:** `npm run test:integration` → the new tests FAIL with 404 (workflow missing).
- [ ] **Step 3:** Write `tests/unit/job-radar.test.mjs`. It loads `workflows/job-radar.json`, takes each Code node's `parameters.jsCode`, runs it via `new Function('$input', '$', code)` with fakes, and tests: validation messages and their order, URL per ATS with and without `apiBase`, normalization per ATS, `dedups keeping the newest`, `matches case-insensitively and trims`, exclude-before-include, remote-flag location match, score/matched/order, limit, errors (404 → status 404, `{error}` → status 0).
- [ ] **Step 4:** `npm test` → FAIL (workflow missing).
- [ ] **Step 5:** Build `workflows/job-radar.json` with the nodes from Architecture. `Fetch Board`: HTTP Request v4.2, `url ={{ $json.url }}`, options `response.response = {fullResponse: true, neverError: true, responseFormat: "json"}`, timeout 15000, `onError: continueRegularOutput`. Respond nodes: 200 `={{ JSON.stringify($json) }}`, 400 `={{ JSON.stringify({ error: $json.error }) }}`.
- [ ] **Step 6:** `npm test` → PASS.
- [ ] **Step 7:** `node scripts/deploy.mjs job-radar.json` then `npm run test:integration` → all PASS (hello + job-radar).
- [ ] **Step 8:** Commit `feat(workflows): add job radar for Greenhouse, Lever and Ashby boards`.

### Task 3: Docs and PR

**Files:**
- Modify: `_docs/progress.md`, `_docs/backlog.md`, `_docs/repo-overview.md` (fixtures container)

- [ ] **Step 1:** Record J1 v1 as done in progress, add the next J1 steps (schedule + `profile.json` + Telegram) to the backlog, and describe `job-fixtures` in the overview.
- [ ] **Step 2:** `npm test` → PASS. Commit `docs: record job radar v1`.
- [ ] **Step 3:** Push and `gh pr create`. Don't merge, don't wait for CI.
