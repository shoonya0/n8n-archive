// Contract for workflows/hello-webhook.json, exercised against the dockerised n8n.
// Requires: npm run n8n:up && npm run n8n:deploy
import { test } from 'node:test';
import assert from 'node:assert/strict';

const BASE = process.env.N8N_BASE_URL ?? 'http://localhost:5678';
const URL_ = `${BASE}/webhook/hello`;

const post = (body) =>
  fetch(URL_, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

test('greets the given name', async () => {
  const res = await post({ name: 'Ada' });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { message: 'Hello, Ada!' });
});

test('trims whitespace around the name', async () => {
  const res = await post({ name: '  Grace  ' });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { message: 'Hello, Grace!' });
});

test('rejects a missing name with 400', async () => {
  const res = await post({});
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { error: 'name is required' });
});
