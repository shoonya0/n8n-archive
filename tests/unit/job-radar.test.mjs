// Logic tests for the Code nodes in workflows/job-radar.json. Each node's jsCode is
// pulled from the workflow JSON and run with fake n8n $input / $() helpers.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { API_BASE, PROFILE, BOARDS, EXPECTED } from '../fixtures/job-boards/expected.mjs';

const wf = JSON.parse(readFileSync('workflows/job-radar.json', 'utf8'));
const fixture = (ats, token) =>
  JSON.parse(readFileSync(`tests/fixtures/job-boards/${ats}/${token}.json`, 'utf8'));

const items = (list) => list.map((json) => ({ json }));
function runCode(nodeName, { input = [], nodes = {} } = {}) {
  const node = wf.nodes.find((n) => n.name === nodeName);
  assert.ok(node, `node "${nodeName}" not found`);
  const $input = { all: () => items(input), first: () => items(input)[0] };
  const $ = (name) => {
    assert.ok(name in nodes, `code referenced unknown node "${name}"`);
    return { all: () => items(nodes[name]), first: () => items(nodes[name])[0] };
  };
  return new Function('$input', '$', node.parameters.jsCode)($input, $).map((i) => i.json);
}

const validate = (body) => runCode('Validate Request', { input: [{ body }] });

// Runs Validate Request, then feeds Rank Jobs the given HTTP responses (one per board).
function rank(body, responses) {
  const boards = validate(body);
  assert.equal(boards[0].error, undefined, `validation failed: ${boards[0].error}`);
  const [result] = runCode('Rank Jobs', {
    input: responses,
    nodes: { 'Validate Request': boards, Webhook: [{ body }] },
  });
  return result;
}
const ok = (body) => ({ statusCode: 200, body });
const fixtureResponses = () => [
  ok(fixture('greenhouse', 'acme')),
  ok(fixture('lever', 'globex')),
  ok(fixture('ashby', 'initech')),
];

describe('Validate Request', () => {
  const good = { boards: BOARDS, profile: PROFILE };
  const error = (body) => validate(body)[0].error;

  test('builds the real API URL for each ATS', () => {
    assert.deepEqual(validate(good), [
      { ats: 'greenhouse', token: 'acme', url: 'https://boards-api.greenhouse.io/v1/boards/acme/jobs' },
      { ats: 'lever', token: 'globex', url: 'https://api.lever.co/v0/postings/globex?mode=json' },
      { ats: 'ashby', token: 'initech', url: 'https://api.ashbyhq.com/posting-api/job-board/initech' },
    ]);
  });

  test('swaps the host for an allowed apiBase', () => {
    assert.deepEqual(
      validate({ ...good, apiBase: API_BASE }).map((b) => b.url),
      [
        'http://job-fixtures:8080/v1/boards/acme/jobs',
        'http://job-fixtures:8080/v0/postings/globex?mode=json',
        'http://job-fixtures:8080/posting-api/job-board/initech',
      ],
    );
  });

  test('rejects bad boards', () => {
    const msg = 'boards must be a non-empty array of at most 50';
    assert.equal(error(undefined), msg);
    assert.equal(error({ profile: PROFILE }), msg);
    assert.equal(error({ boards: [], profile: PROFILE }), msg);
    assert.equal(error({ boards: 'acme', profile: PROFILE }), msg);
    assert.equal(error({ boards: Array(51).fill(BOARDS[0]), profile: PROFILE }), msg);
  });

  test('rejects an unsupported ats', () => {
    assert.equal(error({ ...good, boards: [{ ats: 'workday', token: 'x' }] }), 'unsupported ats: workday');
    assert.equal(error({ ...good, boards: [null] }), 'unsupported ats: undefined');
  });

  test('rejects a token with a slash or dots', () => {
    assert.equal(error({ ...good, boards: [{ ats: 'lever', token: '../acme' }] }), 'invalid token: ../acme');
    assert.equal(error({ ...good, boards: [{ ats: 'lever', token: 'a/b' }] }), 'invalid token: a/b');
    assert.equal(error({ ...good, boards: [{ ats: 'lever', token: '' }] }), 'invalid token: ');
  });

  test('requires at least one non-empty title keyword', () => {
    const msg = 'profile.titleKeywords is required';
    assert.equal(error({ boards: BOARDS }), msg);
    assert.equal(error({ boards: BOARDS, profile: { titleKeywords: [] } }), msg);
    assert.equal(error({ boards: BOARDS, profile: { titleKeywords: ['  '] } }), msg);
  });

  test('rejects a limit outside 1-50', () => {
    const msg = 'limit must be an integer from 1 to 50';
    for (const limit of [0, 51, 2.5, '10']) assert.equal(error({ ...good, limit }), msg);
  });

  test('allows apiBase only for the fixture host', () => {
    const msg = 'apiBase is not allowed';
    assert.equal(error({ ...good, apiBase: 'http://169.254.169.254' }), msg);
    assert.equal(error({ ...good, apiBase: 'http://job-fixtures:@evil.example' }), msg);
    assert.equal(error({ ...good, apiBase: 'https://job-fixtures:8080' }), msg);
    assert.equal(error({ ...good, apiBase: 'not a url' }), msg);
    assert.equal(error({ ...good, apiBase: 'http://job-fixtures:8080/other' }), msg);
    assert.equal(error({ ...good, apiBase: 'http://job-fixtures:8080?x=1' }), msg);
    assert.equal(error({ ...good, apiBase: 42 }), msg);
  });

  test('reports the first error in field order', () => {
    assert.equal(error({ boards: [], profile: {}, limit: 0, apiBase: 'x' }),
      'boards must be a non-empty array of at most 50');
  });
});

describe('Rank Jobs', () => {
  test('ranks the fixture boards as the spec says', () => {
    assert.deepEqual(rank({ boards: BOARDS, profile: PROFILE }, fixtureResponses()),
      { count: 5, jobs: EXPECTED, errors: [] });
  });

  test('dedups keeping the newest', () => {
    const urls = rank({ boards: BOARDS, profile: PROFILE }, fixtureResponses()).jobs.map((j) => j.url);
    assert.ok(urls.includes('https://job-boards.greenhouse.io/acme/jobs/1001'));
    assert.ok(!urls.includes('https://job-boards.greenhouse.io/acme/jobs/1002'));
  });

  test('matches case-insensitively and trims', () => {
    const { jobs } = rank(
      { boards: [BOARDS[2]], profile: { titleKeywords: ['GOLANG'] } },
      [ok(fixture('ashby', 'initech'))],
    );
    assert.deepEqual(jobs.map((j) => [j.title, j.matched]),
      [['Backend Engineer, Golang Services', ['GOLANG']]]);
  });

  test('exclude wins over include, and skips unlisted Ashby jobs', () => {
    const titles = (board, resp) =>
      rank({ boards: [board], profile: { titleKeywords: ['backend'], excludeTitleKeywords: ['manager'] } },
        [ok(resp)]).jobs.map((j) => j.title);
    assert.ok(!titles(BOARDS[0], fixture('greenhouse', 'acme')).includes('Backend Engineering Manager'));
    assert.ok(!titles(BOARDS[2], fixture('ashby', 'initech')).includes('Backend Engineer (Hidden)'));
  });

  test('empty locations keep any location with no location bonus', () => {
    const { jobs } = rank({ boards: [BOARDS[0]], profile: { titleKeywords: ['node'] } },
      [ok(fixture('greenhouse', 'acme'))]);
    assert.deepEqual(jobs.map((j) => [j.title, j.location, j.score, j.matched]),
      [['Node.js Backend Developer', 'Berlin, Germany', 10, ['node']]]);
  });

  test('applies limit after ordering', () => {
    const r = rank({ boards: BOARDS, profile: PROFILE, limit: 3 }, fixtureResponses());
    assert.equal(r.count, 3);
    assert.deepEqual(r.jobs, EXPECTED.slice(0, 3));
  });

  test('reports failed boards and keeps the others', () => {
    const r = rank({ boards: BOARDS, profile: PROFILE }, [
      ok(fixture('greenhouse', 'acme')),
      { statusCode: 404, body: { ok: false, error: 'Document not found' } },
      { error: { message: 'connect ECONNREFUSED' } },
    ]);
    assert.deepEqual(r.errors, [
      { source: 'lever', board: 'globex', status: 404 },
      { source: 'ashby', board: 'initech', status: 0 },
    ]);
    assert.deepEqual(r.jobs.map((j) => j.board), ['acme', 'acme']);
  });
});
