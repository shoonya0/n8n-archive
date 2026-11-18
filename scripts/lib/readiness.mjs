// How deploy.mjs knows n8n has really registered the deployed webhooks.
//
// n8n answers /healthz, and even logs "Editor is now accessible", before it has finished
// registering published workflows (seen in CI with two workflows). A CORS preflight
// (OPTIONS) to the production webhook URL is the reliable check: n8n answers 204 only once
// that webhook is registered, without running the workflow.

/** Webhook endpoints of a workflow: [{ method, path }] with path trimmed of slashes. */
export const webhookProbes = (wf) =>
  (wf.nodes ?? [])
    .filter((n) => n.type === 'n8n-nodes-base.webhook' && n.parameters?.path)
    .map((n) => ({
      method: (n.parameters.httpMethod ?? 'GET').toUpperCase(),
      path: n.parameters.path.replace(/^\/+|\/+$/g, ''),
    }));

/** True when a preflight status means the webhook is registered. */
export const isRegistered = (status) => status === 204;

/** Preflight status for one webhook; 0 when n8n can't be reached. */
export async function preflight(baseUrl, { method, path }) {
  try {
    const res = await fetch(`${baseUrl}/webhook/${path}`, {
      method: 'OPTIONS',
      headers: { Origin: baseUrl, 'Access-Control-Request-Method': method },
      signal: AbortSignal.timeout(5000),
    });
    return res.status;
  } catch {
    return 0;
  }
}

/** Poll until every probe is registered, or throw after timeoutMs. */
export async function waitForWebhooks(baseUrl, probes, { timeoutMs = 90_000, intervalMs = 500 } = {}) {
  const deadline = Date.now() + timeoutMs;
  let pending = probes;
  while (pending.length) {
    const statuses = await Promise.all(pending.map((p) => preflight(baseUrl, p)));
    pending = pending.filter((_, i) => !isRegistered(statuses[i]));
    if (!pending.length) return;
    if (Date.now() > deadline) {
      const list = pending.map((p) => `${p.method} /webhook/${p.path}`).join(', ');
      throw new Error(`webhooks not registered within ${timeoutMs / 1000}s: ${list}`);
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
}
