// Import every workflows/*.json into the dockerised n8n, publish it, then
// restart n8n so production webhooks are registered.
// Usage: node scripts/deploy.mjs [workflow-file.json ...]
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { webhookProbes, waitForWebhooks } from './lib/readiness.mjs';

const WORKFLOW_DIR = 'workflows';
const CONTAINER = process.env.N8N_CONTAINER ?? 'n8n';

const run = (cmd, args) =>
  execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'inherit'], encoding: 'utf8' });

const files = process.argv.slice(2).length
  ? process.argv.slice(2).map((f) => basename(f))
  : readdirSync(WORKFLOW_DIR).filter((f) => f.endsWith('.json'));

for (const file of files) {
  const wf = JSON.parse(readFileSync(join(WORKFLOW_DIR, file), 'utf8'));
  if (!wf.id) throw new Error(`${file}: workflow needs a fixed "id" so re-deploys overwrite it`);
  console.log(`import  ${file} (${wf.id})`);
  run('docker', ['exec', CONTAINER, 'n8n', 'import:workflow', `--input=/workflows/${file}`]);
  console.log(`publish ${wf.id}`);
  run('docker', ['exec', CONTAINER, 'n8n', 'publish:workflow', `--id=${wf.id}`]);
}

console.log('restart n8n to register webhooks');
run('docker', ['compose', 'restart', 'n8n']);
run('docker', ['compose', 'up', '-d', '--wait', 'n8n']);

// "healthy" is not "webhooks registered": wait for each deployed webhook (see lib/readiness.mjs).
const BASE_URL = process.env.N8N_BASE_URL ?? `http://localhost:${process.env.N8N_PORT ?? 5678}`;
const probes = files.flatMap((f) => webhookProbes(JSON.parse(readFileSync(join(WORKFLOW_DIR, f), 'utf8'))));
await waitForWebhooks(BASE_URL, probes);
console.log('deployed:', files.join(', '), `(${probes.length} webhook(s) registered)`);
