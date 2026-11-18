// Contract for workflows/job-radar.json, exercised against the dockerised n8n.
// n8n fetches boards from the job-fixtures container (tests/fixtures/job-boards).
// Requires: npm run n8n:up && npm run n8n:deploy
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { API_BASE, PROFILE, BOARDS, EXPECTED } from '../fixtures/job-boards/expected.mjs';

const BASE = process.env.N8N_BASE_URL ?? 'http://localhost:5678';
const URL_ = `${BASE}/webhook/jobs/radar`;
const radar = async (body) => {
  const res = await fetch(URL_, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json() };
};

test('ranks matches from all three ATS', async () => {
  const { status, body } = await radar({ boards: BOARDS, profile: PROFILE, apiBase: API_BASE });
  assert.equal(status, 200);
  assert.deepEqual(body, { count: 5, jobs: EXPECTED, errors: [] });
});

test('applies limit', async () => {
  const { status, body } = await radar({
    boards: BOARDS, profile: PROFILE, limit: 2, apiBase: API_BASE,
  });
  assert.equal(status, 200);
  assert.deepEqual(body, { count: 2, jobs: EXPECTED.slice(0, 2), errors: [] });
});

test('reports a missing board and still returns the rest', async () => {
  const { status, body } = await radar({
    boards: [{ ats: 'greenhouse', token: 'acme' }, { ats: 'lever', token: 'missing' }],
    profile: PROFILE,
    apiBase: API_BASE,
  });
  assert.equal(status, 200);
  assert.deepEqual(body.errors, [{ source: 'lever', board: 'missing', status: 404 }]);
  assert.deepEqual(body.jobs.map((j) => j.title), [
    'Senior Backend Engineer (Golang)',
    'Platform Engineer (Golang)',
  ]);
});

const rejects = (name, body, error) =>
  test(`400: ${name}`, async () => {
    const res = await radar(body);
    assert.equal(res.status, 400);
    assert.deepEqual(res.body, { error });
  });

rejects('missing boards', { profile: PROFILE },
  'boards must be a non-empty array of at most 50');
rejects('too many boards',
  { boards: Array.from({ length: 51 }, () => BOARDS[0]), profile: PROFILE },
  'boards must be a non-empty array of at most 50');
rejects('unsupported ats', { boards: [{ ats: 'workday', token: 'x' }], profile: PROFILE },
  'unsupported ats: workday');
rejects('a token with a slash',
  { boards: [{ ats: 'greenhouse', token: '../acme' }], profile: PROFILE },
  'invalid token: ../acme');
rejects('missing titleKeywords', { boards: BOARDS, profile: { locations: ['remote'] } },
  'profile.titleKeywords is required');
rejects('limit out of range', { boards: BOARDS, profile: PROFILE, limit: 0 },
  'limit must be an integer from 1 to 50');
rejects('apiBase on another host',
  { boards: BOARDS, profile: PROFILE, apiBase: 'http://169.254.169.254' },
  'apiBase is not allowed');
rejects('apiBase that only looks like the fixture host',
  { boards: BOARDS, profile: PROFILE, apiBase: 'http://job-fixtures:@evil.example' },
  'apiBase is not allowed');
