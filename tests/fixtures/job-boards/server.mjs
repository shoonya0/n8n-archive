// Stand-in for the Greenhouse, Lever and Ashby job-board APIs, used by integration
// tests (docker compose service "job-fixtures"). Serves <ats>/<token>.json next to
// this file for the same paths the real APIs use. Query strings are ignored.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 8080);
const ROUTES = [
  [/^\/v1\/boards\/([A-Za-z0-9_-]+)\/jobs$/, 'greenhouse'],
  [/^\/v0\/postings\/([A-Za-z0-9_-]+)$/, 'lever'],
  [/^\/posting-api\/job-board\/([A-Za-z0-9_-]+)$/, 'ashby'],
];

const send = (res, status, body) => {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(body);
};

createServer(async (req, res) => {
  const path = new URL(req.url, 'http://x').pathname;
  for (const [pattern, ats] of ROUTES) {
    const m = path.match(pattern);
    if (!m) continue;
    try {
      return send(res, 200, await readFile(join(ROOT, ats, `${m[1]}.json`), 'utf8'));
    } catch {
      break;
    }
  }
  send(res, 404, JSON.stringify({ error: 'not found' }));
}).listen(PORT, () => console.log(`job fixtures on :${PORT}`));
