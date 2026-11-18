// The job-board fixture server stands in for the Greenhouse, Lever and Ashby APIs
// during integration tests. Start it on a spare port and check each route.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const PORT = 18080;
const BASE = `http://127.0.0.1:${PORT}`;
let server;

before(async () => {
  server = spawn(process.execPath, ['tests/fixtures/job-boards/server.mjs'], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: 'ignore',
  });
  for (let i = 0; i < 50; i++) {
    try {
      await fetch(BASE);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  throw new Error('fixture server did not start');
});

after(() => server?.kill());

test('serves a Greenhouse board', async () => {
  const res = await fetch(`${BASE}/v1/boards/acme/jobs`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /application\/json/);
  assert.ok(Array.isArray((await res.json()).jobs));
});

test('serves a Lever board as a top-level array', async () => {
  const res = await fetch(`${BASE}/v0/postings/globex?mode=json`);
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(await res.json()));
});

test('serves an Ashby board', async () => {
  const res = await fetch(`${BASE}/posting-api/job-board/initech`);
  assert.equal(res.status, 200);
  assert.ok(Array.isArray((await res.json()).jobs));
});

test('returns 404 JSON for an unknown board', async () => {
  const res = await fetch(`${BASE}/v1/boards/missing/jobs`);
  assert.equal(res.status, 404);
  assert.deepEqual(await res.json(), { error: 'not found' });
});

test('returns 404 for a path-traversal token', async () => {
  const res = await fetch(`${BASE}/v1/boards/..%2F..%2Fserver/jobs`);
  assert.equal(res.status, 404);
});
