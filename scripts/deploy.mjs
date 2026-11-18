// Import every workflows/*.json into the dockerised n8n, publish it, then
// restart n8n so production webhooks are registered.
// Usage: node scripts/deploy.mjs [workflow-file.json ...]
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join, basename } from 'node:path';

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

// n8n answers /healthz (so compose reports "healthy") a few seconds before it has
// registered published webhooks; it logs READY_LINE only once startup is finished.
const READY_LINE = 'Editor is now accessible';
const READY_TIMEOUT_MS = 90_000;
const readyCount = () =>
  execFileSync('docker', ['logs', CONTAINER], { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' })
    .split(READY_LINE).length - 1;

console.log('restart n8n to register webhooks');
const before = readyCount();
run('docker', ['compose', 'restart', 'n8n']);
run('docker', ['compose', 'up', '-d', '--wait', 'n8n']);

const deadline = Date.now() + READY_TIMEOUT_MS;
while (readyCount() <= before) {
  if (Date.now() > deadline) throw new Error(`n8n did not finish starting within ${READY_TIMEOUT_MS / 1000}s`);
  await new Promise((r) => setTimeout(r, 500));
}
console.log('deployed:', files.join(', '));
