// deploy.mjs waits until every deployed webhook is registered. These tests cover the
// pieces that decide what to probe and what counts as "registered".
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { webhookProbes, isRegistered } from '../../scripts/lib/readiness.mjs';

const load = (f) => JSON.parse(readFileSync(`workflows/${f}`, 'utf8'));

test('lists the webhook of each repo workflow', () => {
  assert.deepEqual(webhookProbes(load('hello-webhook.json')), [{ method: 'POST', path: 'hello' }]);
  assert.deepEqual(webhookProbes(load('job-radar.json')), [{ method: 'POST', path: 'jobs/radar' }]);
});

test('defaults the method to GET and ignores non-webhook nodes', () => {
  const wf = {
    nodes: [
      { type: 'n8n-nodes-base.webhook', parameters: { path: 'a' } },
      { type: 'n8n-nodes-base.scheduleTrigger', parameters: {} },
      { type: 'n8n-nodes-base.webhook', parameters: { path: '/b/', httpMethod: 'PUT' } },
    ],
  };
  assert.deepEqual(webhookProbes(wf), [
    { method: 'GET', path: 'a' },
    { method: 'PUT', path: 'b' },
  ]);
});

test('a workflow without webhooks has nothing to probe', () => {
  assert.deepEqual(webhookProbes({ nodes: [{ type: 'n8n-nodes-base.scheduleTrigger' }] }), []);
});

test('only a 204 preflight means registered', () => {
  // Measured on n8n 2.46.3: 204 once registered; 404 while starting; 200 from the
  // startup page; 500 for an unknown path; 0 when the connection is refused.
  assert.equal(isRegistered(204), true);
  for (const status of [0, 200, 404, 500]) assert.equal(isRegistered(status), false);
});
