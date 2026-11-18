// Static checks for every workflow in workflows/. No n8n instance needed.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'workflows';
const files = readdirSync(DIR).filter((f) => f.endsWith('.json'));
const SECRET_PATTERN = /(api[_-]?key|password|secret|token|bearer)["']?\s*[:=]\s*["'][^"'{}$=]{8,}/i;

test('workflows/ contains at least one workflow', () => {
  assert.ok(files.length > 0, 'no workflow JSON files found');
});

for (const file of files) {
  describe(file, () => {
    const raw = readFileSync(join(DIR, file), 'utf8');
    const wf = JSON.parse(raw);
    const names = wf.nodes.map((n) => n.name);

    test('has id, name, nodes and connections', () => {
      assert.match(wf.id, /^[A-Za-z0-9]{16}$/, 'id must be 16 alphanumeric chars');
      assert.ok(wf.name, 'name');
      assert.ok(Array.isArray(wf.nodes) && wf.nodes.length > 0, 'nodes');
      assert.equal(typeof wf.connections, 'object', 'connections');
    });

    test('node names are unique', () => {
      assert.equal(new Set(names).size, names.length);
    });

    test('every node has type, typeVersion and position', () => {
      for (const n of wf.nodes) {
        assert.match(n.type, /^[\w@-]+(\/[\w-]+)?\.[\w]+$/, `${n.name}: type`);
        assert.equal(typeof n.typeVersion, 'number', `${n.name}: typeVersion`);
        assert.ok(Array.isArray(n.position) && n.position.length === 2, `${n.name}: position`);
      }
    });

    test('connections only reference existing nodes', () => {
      for (const [from, outputs] of Object.entries(wf.connections)) {
        assert.ok(names.includes(from), `unknown source node "${from}"`);
        for (const branches of Object.values(outputs))
          for (const branch of branches)
            for (const link of branch ?? [])
              assert.ok(names.includes(link.node), `${from} -> unknown node "${link.node}"`);
      }
    });

    test('has exactly one trigger node', () => {
      const triggers = wf.nodes.filter(
        (n) => /Trigger$/.test(n.type) || n.type === 'n8n-nodes-base.webhook',
      );
      assert.equal(triggers.length, 1, `triggers: ${triggers.map((t) => t.name)}`);
    });

    test('webhook nodes have a path and a webhookId', () => {
      for (const n of wf.nodes.filter((n) => n.type === 'n8n-nodes-base.webhook')) {
        assert.ok(n.parameters?.path, `${n.name}: path`);
        assert.ok(n.webhookId, `${n.name}: webhookId`);
      }
    });

    test('contains no hard-coded secrets', () => {
      assert.doesNotMatch(raw, SECRET_PATTERN);
    });
  });
}

test('webhook paths are unique across workflows', () => {
  const paths = files.flatMap((f) =>
    JSON.parse(readFileSync(join(DIR, f), 'utf8'))
      .nodes.filter((n) => n.type === 'n8n-nodes-base.webhook')
      .map((n) => `${n.parameters.httpMethod ?? 'GET'} ${n.parameters.path}`),
  );
  assert.equal(new Set(paths).size, paths.length, `duplicates in ${paths}`);
});
