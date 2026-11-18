// Shared test data: the profile and boards used against the fixtures in this folder,
// and the ranked result the spec's rules give for them.
export const API_BASE = 'http://job-fixtures:8080';

export const PROFILE = {
  titleKeywords: ['backend', 'golang', 'node'],
  excludeTitleKeywords: ['manager', 'intern'],
  locations: ['remote', 'india'],
};

export const BOARDS = [
  { ats: 'greenhouse', token: 'acme' },
  { ats: 'lever', token: 'globex' },
  { ats: 'ashby', token: 'initech' },
];

export const EXPECTED = [
  {
    source: 'ashby', board: 'initech', company: 'initech',
    title: 'Backend Engineer, Golang Services', location: 'Remote (APAC) / Singapore',
    url: 'https://jobs.ashbyhq.com/initech/b1b2c3d4-0001-4000-8000-000000000001',
    postedAt: '2026-11-12T00:00:00.000Z', score: 25, matched: ['backend', 'golang', 'remote'],
  },
  {
    source: 'greenhouse', board: 'acme', company: 'Acme',
    title: 'Senior Backend Engineer (Golang)', location: 'Remote, India',
    url: 'https://job-boards.greenhouse.io/acme/jobs/1001',
    postedAt: '2026-11-10T09:00:00.000Z', score: 25,
    matched: ['backend', 'golang', 'remote', 'india'],
  },
  {
    source: 'lever', board: 'globex', company: 'globex',
    title: 'Backend Engineer - Payments', location: 'Pune, India / Remote - India',
    url: 'https://jobs.lever.co/globex/a1b2c3d4-0001-4000-8000-000000000001',
    postedAt: '2026-11-08T00:00:00.000Z', score: 15, matched: ['backend', 'remote', 'india'],
  },
  {
    source: 'lever', board: 'globex', company: 'globex',
    title: 'Software Engineer, Node', location: 'Amsterdam',
    url: 'https://jobs.lever.co/globex/a1b2c3d4-0002-4000-8000-000000000002',
    postedAt: '2026-11-08T00:00:00.000Z', score: 15, matched: ['node', 'remote'],
  },
  {
    source: 'greenhouse', board: 'acme', company: 'Acme',
    title: 'Platform Engineer (Golang)', location: 'Bengaluru, India',
    url: 'https://job-boards.greenhouse.io/acme/jobs/1006',
    postedAt: '2026-11-05T06:30:00.000Z', score: 15, matched: ['golang', 'india'],
  },
];
