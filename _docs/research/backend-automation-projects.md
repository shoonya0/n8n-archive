# Automation projects for a backend developer, ranked

Research date: **18 Nov 2026**. Survey numbers, free tiers and platform rules change, so check
the linked sources before you rely on a figure. Nothing here has been built yet.

**Who this is for:** a backend developer who ships their own projects and is actively job
hunting. Your public repos are mostly **Go** (ECHO, BucksPe, My-Agent, Swift-Stream) and
**Node.js** (rutoo-backend, CRM-Backend, Chat-App), and several are take-home assignments
(Primetrade.ai, FRETRON, HackerRank Orchestrate). I could not read your LinkedIn profile
because it needs a login.

This file replaces `mobile-automation-projects.md`. Working from a phone is now one project
(#13) instead of the theme of the whole file.

---

## Bottom line

- **Coding is a small part of the job, so automate the rest.** In Atlassian's 2025 survey of
  3,500 developers, developers spent about **16% of their time coding**, and **50% lost 10+
  hours a week** to friction. The biggest cause was **finding information**.
- **AI now writes much of the code, so checking it is the new bottleneck.** GitHub reports
  that agents started **over 40% of pull requests** by September 2026. In Sonar's 2026 survey,
  **96%** of developers don't fully trust AI code but only **48%** always verify it. That is
  why CI, tests and automated review rank at the top.
- **The highest-ranked projects are cheap.** The top two (a CI pipeline, and secret and
  dependency protection) take about a day together and pay off on every push.
- **Your personal order is slightly different** because you're job hunting. A reusable CI
  setup and a service template make every repo and take-home look professional, and a
  job-hunt pipeline saves hours a week. See [your order](#your-order).

### How the ranking works

Each project is ranked by judgment on four things, and the scores are shown so you can
disagree:

| Factor | Question |
|---|---|
| **Impact** (1–5) | How much time or risk does it remove? |
| **Pays off** | How often: every push, daily, weekly, or rarely |
| **Effort** | Rough build time for one developer |
| **Evidence** | **A** = study or large primary dataset · **B** = official platform data or a large vendor survey · **C** = vendor or blog claims only · **D** = my design judgment, no source |

Evidence breaks ties. A cheap project that pays off on every push beats an impressive one
that pays off once a month.

---

## The ranked list

| # | Project | Impact | Pays off | Effort | Evidence | Build where |
|---|---|---|---|---|---|---|
| 1 | [CI pipeline (one reusable workflow)](#1-ci-pipeline-one-reusable-workflow) | 5 | every push | 1 day | B | GitHub Actions |
| 2 | [Secret and dependency protection](#2-secret-and-dependency-protection) | 5 | every push | ½ day | A/B | GitHub settings + hooks |
| 3 | [AI coding-agent setup with guardrails](#3-ai-coding-agent-setup-with-guardrails) | 5 | daily | 1–2 days | A/B | each repo |
| 4 | [Automated PR review and verification gate](#4-automated-pr-review-and-verification-gate) | 4 | every PR | 1–2 days | A/B | GitHub Actions or n8n |
| 5 | [Test generation and flaky-test detection](#5-test-generation-and-flaky-test-detection) | 4 | every push | 2 days | A | CI + n8n |
| 6 | [Observability and alert triage](#6-observability-and-alert-triage) | 5 | weekly (when things break) | 2–3 days | B/C | n8n + Docker |
| 7 | [Code and docs knowledge assistant](#7-code-and-docs-knowledge-assistant) | 5 | daily | 3 days | B | MCP server |
| 8 | [One-command local dev environment](#8-one-command-local-dev-environment) | 4 | each setup | 1–2 days | D | each repo |
| 9 | [API contract and docs automation](#9-api-contract-and-docs-automation) | 4 | every API change | 2 days | B | CI |
| 10 | [Database safety automation](#10-database-safety-automation) | 4 | weekly, plus migrations | 2 days | D | CI + n8n |
| 11 | [Release automation](#11-release-automation) | 2 | each release | ½ day | D | GitHub Actions |
| 12 | [Daily dev digest and review nudges](#12-daily-dev-digest-and-review-nudges) | 2 | daily | 1 day | A | n8n |
| 13 | [ChatOps and phone control](#13-chatops-and-phone-control) | 3 | daily, if you're often away | 3 days | B | n8n + Telegram |
| 14 | [Service template ("golden path")](#14-service-template-golden-path) | 3 | each new project | 2 days | B | template repos |
| 15 | [Preview environments per PR](#15-preview-environments-per-pr) | 3 | every PR | 3–4 days | C | VPS + Actions |
| J | [Job-hunt pipeline (personal track)](#j-job-hunt-pipeline-personal-track) | 5 *while job hunting* | daily | 5–8 days | B/C | n8n |

---

## Tier 1: do these first

### 1. CI pipeline (one reusable workflow)

**What it automates:** lint, type checks, tests, builds and Docker images on every push, so
mistakes are caught in minutes, not in production or in an interview demo.

**Why it ranks #1**
- **B:** GitHub reports **11.5 billion Actions minutes** in public projects in 2025, up 35%.
  CI is the standard baseline.
- **B:** DORA's 2025 report found that teams with **fast feedback loops** get more out of AI,
  while teams with slow ones see little or no benefit.
- Every other project on this list plugs into CI.

**Build it**
1. Make a repo `shoonya0/.github` (or `ci-templates`) with **reusable workflows**
   (`on: workflow_call`): `go-ci.yml` and `node-ci.yml`.
2. Go: `actions/setup-go` with cache → `golangci-lint` → `go vet` →
   `go test -race -coverprofile=cover.out ./...` → `docker build`.
3. Node: `actions/setup-node` with cache → `npm ci` → `eslint` → `tsc --noEmit` →
   `npm test` → `docker build`.
4. Integration tests run against **service containers** (`postgres:16`, `redis`) in the same
   job.
5. Each repo calls it in about 5 lines:
   `uses: shoonya0/.github/.github/workflows/go-ci.yml@main`.
6. **Branch protection:** require CI to pass before merging to `main`.
7. **This repo:** add a job that runs `npm test`, plus a second job that brings up
   docker compose, runs `npm run n8n:deploy` and then `npm run test:integration`.

**Done when:** every active repo shows a green CI badge, a red PR can't be merged, and CI
finishes in under 10 minutes.

**Portfolio angle:** recruiters who open your repos see tests and green badges first.

---

### 2. Secret and dependency protection

**What it automates:** stops leaked keys before they are pushed, and keeps dependencies
patched without manual checks.

**Why it ranks #2**
- **Reported:** Truffle Security found **543,699 credentials that still worked** in public
  GitHub repos in July 2026. **C:** GitGuardian counted **28.6 million new secrets** in public
  commits in 2025.
- **A:** an academic study of Dependabot found **74.5%** of its security PRs were merged.
  Automated update PRs do get merged.
- It costs half a day and protects every repo you own.

**Build it**
1. Turn on **secret scanning and push protection** for all your repos. GitHub made push
   protection free for public repos.
2. Add **gitleaks** as a pre-commit hook. You already run `~/.claude/hooks/git-guard.mjs`, so
   you can add a gitleaks call there too.
3. Add **Dependabot or Renovate** config: group minor and patch updates into one weekly PR,
   and **automerge patch updates when CI passes** (Renovate has this built in).
4. Add vulnerability checks to CI: `govulncheck ./...` for Go and
   `npm audit --omit=dev --audit-level=high` for Node.
5. Turn on **CodeQL default setup** (free for public repos).

**Done when:** a test commit with a fake AWS key is blocked locally and by GitHub, and a
week of dependency PRs needed no manual work.

---

### 3. AI coding-agent setup with guardrails

**What it automates:** turns "write this feature" into a PR that an agent writes, follows
your rules and tests itself, while you review.

**Why it ranks #3**
- **Reported** (coverage of GitHub's Octoverse 2026): agents started **over 40% of PRs** in
  September 2026, up from 17% in March, and about 90% of agent PRs were merged within two
  weeks.
- **B:** Stack Overflow's April 2026 pulse survey: **59%** use agents at work (up from 31% in
  2025), and **60% block agents from making unapproved system changes**.
- **A:** a 2026 Microsoft study measured **+24% merged PRs** per engineer per day with
  command-line coding agents.
- **Caveat (C):** LinearB reports developers *feel* about 20% faster with AI but measure
  about 19% slower end to end. That's why the guardrails below matter.

**Build it**
1. **A rules file in every repo** (`CLAUDE.md` / `AGENTS.md`) listing build, test and lint
   commands, the folder layout, and the rules. This repo's `CLAUDE.md` is a good model.
2. **Skills for repeated jobs:** "add an endpoint" (handler + validation + test + OpenAPI),
   "add a migration", "write table-driven tests".
3. **Hooks:** format and run tests after edits, block commits to `main`, and block secrets
   (your `git-guard.mjs` already does part of this).
4. **Issue templates** with *context*, *acceptance criteria* and *how to test*, so an issue
   can go straight to an agent (Copilot coding agent, or Claude Code).
5. **A permission allowlist** for read-only commands (the `fewer-permission-prompts` skill
   can generate one).
6. **Measure it:** count agent PRs merged against those reverted or abandoned each month.

**Done when:** three real issues have gone from issue to agent to a green PR that you merged
with only small edits.

---

### 4. Automated PR review and verification gate

**What it automates:** a first-pass review of every PR (summary, risks, missing tests)
before a human, or you, reads it.

**Why it ranks #4**
- **B:** Sonar 2026 (1,100+ developers): AI is **42% of committed code**, yet only **48%**
  of developers always verify it. Sonar calls this the "verification bottleneck". Sonar sells
  review tools, so it has an interest in this finding.
- **A:** in an enterprise study of 802 developers, AI review coverage rose from **19% to
  84%** of PRs while human review fell from 89% to 68%. A study of 1.02 million PRs found
  agent-involved reviews made decisions **faster but did not improve quality**. So use AI
  review as a first pass, not as the final decision.

**Build it**
1. **A PR template** with *what changed*, *why*, *how tested* and *risk*.
2. **An AI review action** on `pull_request`, using the Claude Code GitHub Action, Copilot
   code review, or your own script. It checks error handling, input validation, SQL and
   auth changes, missing tests and breaking API changes, and posts **one** summary comment,
   not 30 small ones.
3. **Static analysis as required checks:** `golangci-lint`, **Semgrep** (free rules for
   Go and JS), plus coverage on changed lines (for example, fail if new code is under 60%).
4. **A size warning:** label PRs over 400 changed lines `needs-split`.
5. **An n8n version (optional, fits this repo):** GitHub webhook → `POST /webhook/pr-review`
   → fetch the diff → LLM checklist → comment. Contract test: a fixture diff with
   string-built SQL → the comment mentions SQL injection.

**Done when:** every PR gets a summary within 5 minutes, and in a month the review caught at
least one real bug.

---

### 5. Test generation and flaky-test detection

**What it automates:** writes the boring tests, and finds tests that fail at random so you
stop re-running CI.

**Why it ranks #5**
- **A:** an ICST 2024 industrial study measured flaky tests at **at least 2.5% of
  productive developer time** (1.1% investigating false failures, 1.3% fixing tests).
- **Reported:** Slack cut test-job failures from **56.76% to 3.85%** of CI failures after
  investing in flaky-test tooling.
- **B:** test generation is the 2nd most common agent use (61%) in Sonar 2026.

**Build it**
1. **Test generation:** an agent skill that writes table-driven Go tests (or Vitest/Jest
   tests) for the functions changed in a branch. CI reports coverage on changed lines.
2. **Collect results:** CI uploads JUnit XML (`gotestsum --junitfile`, `jest-junit`).
3. **Detect flakes** (n8n workflow or a small Go CLI): store results per test per commit.
   A test that both **passed and failed on the same commit** is flaky.
4. **Quarantine:** keep flaky tests in `quarantine.txt`, retry only those, and open one
   issue per flaky test (which feeds #3).
5. **Weekly report:** the top 5 flaky tests and CI minutes wasted on reruns.

**Done when:** no unexplained red builds for two weeks, and every flaky test has an issue.

---

## Tier 2: big wins, more work

### 6. Observability and alert triage

**What it automates:** spots problems before users or recruiters do, groups duplicate
errors, and gives you a first-pass diagnosis.

**Why it ranks here**
- **Reported** (Catchpoint 2025 SRE Report, cited by PagerDuty): the median SRE spends
  **20% of their time on repetitive manual work**, up from 14%. **C:** PagerDuty's 2024
  survey found responders spent **38%** of their time on manual incident processes.
- **Official guidance:** Google's SRE book caps toil at **50%** of an engineer's time and
  treats automation as the fix.
- Impact is high, but it only pays off when something breaks, so it ranks below the
  every-push projects.

**Build it**
1. **Structured logs** with request IDs (`log/slog` in Go, `pino` in Node), plus a
   `/healthz` endpoint (and `/readyz` that checks the DB).
2. **Uptime checks:** an n8n schedule every 5 minutes (or Uptime Kuma). Alert after **2
   failures in a row** and send one "recovered" message.
3. **Error ingestion:** `POST /webhook/error` → **fingerprint** (error type + top stack
   frame) → count. Alert only on new fingerprints or spikes.
4. **Triage message:** the alert includes the last 50 log lines, the last deploy's commit
   list and a two-line LLM guess at the cause. It has buttons for **[Create issue]**
   (feeds #3) and **[Runbook]**.
5. **Metrics (optional):** Prometheus + Grafana in docker compose.

**Contract test:** the same stack trace sent twice → one fingerprint with `count: 2`.

**Done when:** you hear about a broken demo from an alert, not from a person.

---

### 7. Code and docs knowledge assistant

**What it automates:** answers questions like "why did we pick X?", "where is Y handled?" or
"how do I run Z?" from your own repos and notes, instead of you searching.

**Why it ranks here:** **B:** in Atlassian's 2025 survey, **finding information** was the
#1 source of friction, and 50% of developers lost 10+ hours a week. It ranks below the top
five only because it takes longer to build.

**Build it**
1. **Write things down first:** add a `docs/adr/` folder (decision records, from a
   template), runbooks, and good PR descriptions. The assistant can only find what exists.
2. **Start simple:** an MCP server (Go or Node) with tools `search_docs` (ripgrep over
   `docs/`, READMEs and `CLAUDE.md` files across repos), `get_file` and `list_endpoints`
   (from OpenAPI specs).
3. **Then add semantic search:** embeddings in Postgres + **pgvector**, re-indexed by a
   GitHub push webhook (n8n).
4. **Connect it to Claude Code**, so the agent in #3 can use it too.
5. The code-graph tool you already run (code-review-graph) covers *code structure*. This
   project adds *decisions, docs and runbooks*.

**Done when:** it answers 8 of 10 real questions about your projects with a correct link.

---

### 8. One-command local dev environment

**What it automates:** `make up` gives you a running app, database and seed data on any
machine, a Codespace, or for any agent.

**Why it ranks here:** **D:** I found no good survey on this. It ranks here because every
new machine, collaborator, take-home reviewer and coding agent needs it, and agents can't
test what they can't run.

**Build it**
1. `docker-compose.yml`: app, Postgres, Redis, Mailpit (catches emails), with health checks.
2. A `Makefile` or `justfile`: `up`, `down`, `seed`, `test`, `reset`, `logs`.
3. `.env.example` with safe defaults, and a check that fails fast when a variable is
   missing.
4. `.devcontainer/devcontainer.json`, so the repo opens in GitHub Codespaces (this also
   works from a tablet browser).
5. Seed scripts with realistic fake data.

**Done when:** a fresh clone gets from `git clone` to passing tests with **two commands**.
This repo already does this with `npm run n8n:up`.

---

### 9. API contract and docs automation

**What it automates:** API docs, client code and breaking-change checks are generated from
one spec, so they never drift from the code.

**Why it ranks here:** **B:** documentation is the **#1 agent use (68%)** in Sonar 2026, and
Stack Overflow 2025 found developers are most willing to hand docs to AI. Generating docs
from a spec is more reliable than having an LLM write them.

**Build it**
1. **OpenAPI as the source of truth:** write it by hand, or generate it (`swaggo` for Go,
   `zod-to-openapi` for Node).
2. **CI:** lint with **Spectral**, and run **oasdiff** on every PR so breaking changes
   fail unless the PR is labelled `breaking`.
3. **Docs site:** Redoc or Scalar published to GitHub Pages on merge.
4. **Contract tests:** **Schemathesis** fuzzes the running API against the spec in CI.
5. **Postman:** sync the spec to a Postman collection. The Postman MCP is connected in this
   Claude Code session, so that step can be automated.

**Done when:** removing a response field in code fails the PR with a clear message.

---

### 10. Database safety automation

**What it automates:** checks risky migrations, takes backups, and **proves the backups can
be restored**.

**Why it ranks here:** **D:** it doesn't pay off often, but one unrestorable backup or one
table-locking migration can cost days. The restore test is the step most people skip.

**Build it**
1. Versioned migrations (`goose` or `golang-migrate` for Go, Prisma or Knex for Node).
2. **CI:** run migrations up, down and up again on a fresh Postgres. Lint them with
   **squawk**, which flags locking changes such as a missing `CONCURRENTLY`.
3. **A nightly backup** (n8n schedule): `pg_dump` → compress → copy to off-site storage.
4. **A weekly restore test:** restore into a temporary container, check row counts for key
   tables, then post ✅ or ❌.
5. **A weekly slow-query digest** from `pg_stat_statements`: the top 5 by total time.

**Contract test:** `POST /webhook/restore-check` with a fixture dump → `{ ok: true,
tables: {...} }`.

---

### 11. Release automation

**What it automates:** version numbers, changelogs, tags, images and release notes, all
from your commit messages.

**Why it ranks here:** **D:** it saves minutes per release, not hours, but it costs half a
day. You already write Conventional Commits (your global git rules), so it works almost
for free.

**Build it:** **release-please** action → a release PR with a changelog → on merge, a tag and
GitHub release → build and push the image to GHCR with an SBOM → a deploy job behind a
GitHub **environment approval**.

---

### 12. Daily dev digest and review nudges

**What it automates:** one morning message with everything that needs you, and polite
reminders on stale reviews.

**Why it ranks here:** **A:** Meta's controlled NudgeBot trial cut time in review by
**6.8%**, and Microsoft reported 60% faster resolution of overdue reviews (**Reported**). As
a solo developer you have fewer reviews to chase, so it ranks lower.

**Build it** (n8n, fits this repo):
1. A Schedule Trigger at 8:30 → GitHub search API: PRs waiting for you, your PRs with no
   review for 24 hours, red CI on default branches, Dependabot PRs, issues assigned to you.
2. Build the message **with templates, not an LLM**, so it can't get facts wrong.
3. Nudge after 24 hours with no activity, and skip weekends (Meta found the day of the week
   was the biggest factor in review delays).

**Contract test:** `POST /webhook/digest` with fixture GitHub data → the expected message
text.

---

## Tier 3: useful once the basics exist

### 13. ChatOps and phone control

**What it automates:** checking and approving work from a phone, without a laptop.

**Why it ranks here:** **B:** the building blocks are now official features. Claude Code's
**Remote Control** (`/rc`) lets the Claude mobile app drive a session on your machine, and
GitHub Mobile can **assign issues to Copilot's coding agent** and merge PRs. The value
depends on how often you're away from your desk.

**Build it**
1. **Front door:** a private Telegram bot → n8n Telegram Trigger, where the first node
   drops any chat ID that isn't yours. Telegram needs a public **HTTPS** webhook, so use a
   Cloudflare Tunnel that exposes only `/webhook/*`, and keep the n8n editor on Tailscale.
2. **Commands:** `/status`, `/logs <svc>`, and `/deploy <svc>`, which triggers GitHub Actions
   `workflow_dispatch` behind an n8n **Send and Wait** approval. **Never run free-form shell
   commands from chat.**
3. **Voice note → issue:** speech-to-text → LLM drafts a structured issue → **[Create +
   assign agent]** (feeds #3).
4. **Urgent alerts** go to **ntfy**, separate from chat (use a long random topic name; topic
   names on the public ntfy server aren't private).
5. **Emergency shell:** Termux or Termius with mosh + tmux over Tailscale.

**Risks:** run `/security-review` before merging. **Reported:** a 2025 n8n issue said Send
and Wait could keep waiting after a reply, so set timeouts.

---

### 14. Service template ("golden path")

**What it automates:** a new service or take-home starts in 5 minutes with CI, Docker,
config, logging, health checks, tests and a rules file already in place.

**Why it ranks here:** **B:** DORA 2025 reports **90%** of organizations have adopted
platform engineering, and calls a good internal platform the base for getting value from
AI. For a solo developer it only pays off per new project, hence #14. **For you it ranks
higher**, because take-home assignments are timed (see [your order](#your-order)).

**Build it:** template repos `go-service-template` and `node-service-template`, with #1 CI,
#2 security config, #3 `CLAUDE.md` and skills, #8 Makefile and compose, #9 OpenAPI, and
`/healthz`, `slog`/`pino`, graceful shutdown and a config loader. Create new repos with
`gh repo create <name> --template shoonya0/go-service-template`.

---

### 15. Preview environments per PR

**What it automates:** every PR gets its own running copy at `pr-12.preview.<domain>`, so
you can test it before merging, including from a phone.

**Why it ranks last:** **C:** the benefit claims come mostly from vendors that sell this.
Backend isolation (a separate database and queues per PR) is the hard part, and costs grow
with each open PR.

**Build it:** on a PR labelled `preview`, GitHub Actions connects over Tailscale to your
VPS and runs `docker compose -p pr-<n> up` with the PR image and a seeded database. Caddy
or Traefik routes the subdomain. Tear it down when the PR closes, and clean up anything
older than a TTL each night.

---

## J. Job-hunt pipeline (personal track)

Not every backend developer needs this, but **while you're job hunting it's one of your
highest-value projects**. It's built in n8n in this repo, and each step has a webhook
contract test.

| Step | What it does | Key rule |
|---|---|---|
| **J1 Job radar** | Twice a day: fetch jobs from the public **Greenhouse** (`boards-api.greenhouse.io/v1/boards/{token}/jobs`), **Lever** (`api.lever.co/v0/postings/{co}?mode=json`) and **Ashby** job-board APIs, plus **HN "Who is hiring"** (Algolia API), **Remotive** and **Adzuna** (covers India). Normalize, dedup on company + title + location, filter in code, then LLM-score against your `profile.json`. Send the top 10 to Telegram | Remotive asks for infrequent calls, a link back, and has a 24 h delay. Adzuna's free limits differ by source |
| **J2 Tracker** | Gmail Trigger → classify (applied, rejected, assessment, interview, offer) → upsert into an `applications` table with status history → follow-up reminder after 7 days → weekly funnel report by source | Don't send email bodies to free LLM tiers (see risks) |
| **J3 Resume tailor** | Master resume as YAML bullets → LLM picks and rewords bullets for a JD → **code check rejects any bullet or number not in the master** → PDF | Vendor claims about callback gains are unproven. Tailor for relevance, never invent |
| **J4 Deadlines** | Assessment or interview emails → calendar event + reminders at 48 h, 24 h and 2 h + **[Create repo]** from your #14 template | Take-homes start with CI and tests already in place |
| **J5 Practice coach** | A daily backend question → you answer by voice → graded against a rubric → weak topics repeat after 1, 3 and 7 days | Seed it from the skills J1 shows are most in demand |
| **J6 Outreach drafts** | Drafts referral and recruiter messages. **You send them yourself** | LinkedIn bans bots that message or add contacts |

**Platform rules:** LinkedIn's help pages prohibit bots and unauthorized automation
(**Official**). Naukri's terms prohibit automated crawling and scraping (**Reported**).
Only read their **job-alert emails** in J2.

---

## Your order

Adjusted for someone who is **job hunting and shipping projects at the same time**:

| Week | Build | Why now |
|---|---|---|
| 1 | **#1 CI** + **#2 Security** as reusable workflows on all your public repos | Every repo a recruiter opens looks maintained. About a day of work |
| 1 | **#14 Service template** (moved up from #14) | Take-homes start in 5 minutes with CI, tests and Docker |
| 2 | **J1 Job radar** + **J2 Tracker** | More opportunities, no missed replies |
| 3 | **#3 Agent setup** + **#4 PR review** | Faster building, with checks |
| 4 | **#6 Observability** on your live demos + **J4 Deadlines** | Demos stay up, deadlines aren't missed |
| 5 | **#5 Tests/flaky** + **#12 Digest** + **J3 Tailor** | Daily habits |
| 6+ | **#7, #9, #10, #8, #11, #13, J5, J6, #15** | When the basics are solid |

**For each n8n project, follow this repo's process** (`CLAUDE.md`): brainstorm → plan →
**red** (write `tests/integration/<name>.test.mjs` and watch it fail) → **green** (build
`workflows/<name>.json`, run `npm run n8n:deploy`) → `npm test` → feature branch → PR.
Give workflows a `$env.DRY_RUN` switch that swaps outgoing calls for fixture responses, so
tests don't need real keys.

**Which projects live where**

| Here, as n8n workflows | GitHub config (`.github` repo or each repo) | Separate code repos |
|---|---|---|
| #6, #10 (backup/restore), #12, #13, J1–J6, and optionally #4 and #5 (collector) | #1, #2, #3, #4, #9, #11, #15 | #7 (MCP server), #14 (templates), Go CLI for #5 |

---

## Free stack and costs

| Need | Free option | Catch |
|---|---|---|
| CI, releases | GitHub Actions | Free for public repos. Private repos get a monthly minutes allowance |
| Security | Push protection, CodeQL, Dependabot (free on public repos), gitleaks, Renovate, Semgrep | Some features cost money on private repos |
| Workflow engine | n8n self-hosted | **Reported:** the Sustainable Use License allows personal and internal use |
| Host | Your PC → Oracle Always Free (Arm) | **Reported:** cut to about 2 OCPU / 12 GB in 2026 |
| Networking | Cloudflare Tunnel, Tailscale Personal | A domain costs about $1–10 a year. Tailscale's free plan is non-commercial |
| Notifications | Telegram bot, ntfy | ntfy public topics aren't private |
| LLM | Free tiers for non-personal data. A small paid key for emails and resumes | See risks |
| Coding agents | Claude Code (Pro/Max), Copilot (paid plans) | The main optional cost |

---

## Rules and risks

1. **Agents and AI review make mistakes.** Keep CI and tests as the gate (#1, #4, #5), and
   keep a human merge for anything touching auth, payments, migrations or deploys.
2. **Personal data and free LLMs:** **Official:** Google's Gemini API terms say free-tier
   prompts can be used to improve Google's products and read by human reviewers, and advise
   against sending personal data. Assume the same of other free tiers until you've read
   their terms.
3. **ChatOps security:** allowlist your chat ID, check webhook signatures (GitHub HMAC), use
   no free-form shell, keep secrets in n8n credentials or `$env` (never in workflow JSON),
   and log every write action.
4. **Platform terms:** no LinkedIn or Naukri bots, and no mass auto-apply.
5. **Survey limits:** most numbers above come from vendor surveys (Atlassian, Sonar,
   PagerDuty) by companies that sell the fix. The **A**-grade sources (the flaky-test study,
   Meta's trial, the Dependabot study and the Microsoft agent study) are the most reliable.

---

## Sources

**Developer time and friction**
- [Atlassian: State of DevEx 2025](https://www.atlassian.com/blog/developer/developer-experience-report-2025)
- [The New Stack: finding information is engineering's biggest time sink](https://thenewstack.io/fixing-engineerings-biggest-time-suck-finding-information/)
- [JetBrains: State of Developer Ecosystem 2025 (coverage)](https://www.developer-tech.com/news/ai-skills-now-vital-software-developers-people-matter-most/)
- [DORA 2025: State of AI-assisted Software Development (PDF)](https://services.google.com/fh/files/misc/2025_state_of_ai_assisted_software_development.pdf)
- [InfoQ: DORA 2025 findings](https://www.infoq.com/news/2025/09/dora-state-of-ai-in-dev-2025)

**AI agents and verification**
- [Visual Studio Magazine: Octoverse 2026, agents started 40%+ of PRs](https://visualstudiomagazine.com/articles/2026/10/29/github-octoverse-agents-started-more-than-40-percent-of-september-pull-requests.aspx)
- [GitHub: what 986 million pushes say about 2025](https://github.blog/news-insights/octoverse/what-986-million-code-pushes-say-about-the-developer-workflow-in-2025/)
- [Stack Overflow: agents on a leash (2026 pulse survey)](https://stackoverflow.blog/2026/05/27/agents-on-a-leash-agentic-ai-remains-mostly-monitored-at-work)
- [Stack Overflow 2026 survey: AI](https://survey.stackoverflow.co/2026/ai)
- [Sonar: verification gap press release](https://www.sonarsource.com/company/press-releases/sonar-data-reveals-critical-verification-gap-in-ai-coding/)
- [Sonar: State of Code 2026 report (PDF)](https://www.sonarsource.com/state-of-code-developer-survey-report.pdf)
- [The Register: devs don't trust AI code but don't check it](https://www.theregister.com/2026/01/09/devs_ai_code/)
- [TechRepublic: Microsoft study, agents lift merged PRs 24%](https://www.techrepublic.com/article/news-ai-coding-agents-microsoft-pull-requests/)
- [arXiv: human–AI teaming and review practices in open source](https://arxiv.org/html/2601.13754v1)
- [alphaXiv 2607.13196: agentic code review at scale](https://www.alphaxiv.org/abs/2607.13196)
- [LinearB: 2026 benchmarks](https://linearb.io/dev-interrupted/podcast/linearb-2026-benchmarks-ai-pr-merge-rate)

**Testing, review, dependencies, secrets**
- [ICST 2024: Cost of flaky tests in CI, an industrial case study](https://conf.researchr.org/details/icst-2024/icst-2024-industry/1/Cost-of-Flaky-Tests-in-CI-An-Industrial-Case-Study)
- [Mendral: what flaky tests cost](https://mendral.com/blog/flaky-tests-cost)
- [Meta Engineering: improving code review time](https://engineering.fb.com/2022/11/16/culture/meta-code-review-time-improving/)
- [DX newsletter: accelerating code reviews with nudges](https://newsletter.getdx.com/p/accelerating-code-reviews-with-nudges)
- [arXiv: Dependabot in practice](https://arxiv.org/pdf/2206.07230)
- [BleepingComputer: 543,000 valid credentials in public GitHub repos](https://bleepingcomputer.com/news/security/over-543-000-valid-credentials-exposed-in-public-github-repositories)
- [GitGuardian: State of Secrets Sprawl 2026](https://gitguardian.com/state-of-secrets-sprawl-report-2026)
- [GitHub: push protection free for public repos](https://github.blog/news-insights/product-news/push-protection-is-generally-available-and-free-for-all-public-repositories/)
- [AppSecSanta: Renovate overview](https://appsecsanta.com/renovate)

**Operations and toil**
- [Google SRE book: Eliminating Toil](https://sre.google/sre-book/eliminating-toil/)
- [PagerDuty: time to rethink operations with AI (cites Catchpoint SRE report)](https://www.pagerduty.com/blog/ai/ts-time-to-rethink-operations-with-ai)
- [PagerDuty: automation survey whitepaper (2024)](https://pagerduty.com/wp-content/uploads/2024/06/Whitepaper_Automation-survey.pdf)
- [Qovery: architecting backend preview environments](https://www.qovery.com/blog/architecting-backend-preview-environments)
- [Plane: replacing shared staging with ephemeral previews](https://plane.so/blog/how-we-replaced-shared-staging-with-ephemeral-deployment-preview)

**Phone control and n8n**
- [TechRadar: Claude Code Remote Control](https://www.techradar.com/pro/anthropic-reveals-remote-control-a-mobile-version-of-claude-code-to-keep-you-productive-on-the-move)
- [GitHub Changelog: Copilot coding agent on GitHub Mobile](https://github.blog/changelog/2025-06-04-github-copilot-coding-agent-now-available-on-github-mobile)
- [n8n community: Telegram Trigger needs HTTPS](https://community.n8n.io/t/telegram-trigger-bad-request-bad-webhook-an-https-url-must-be-provided-for-webhook/212165)
- [n8n GitHub issue #13331: Send and Wait](https://github.com/n8n-io/n8n/issues/13331)
- [n8n license FAQ](https://docs.n8n.io/n8n-community-license/community-license/license-faq)
- [TerminalBytes: Oracle Cloud free tier changes 2026](https://terminalbytes.com/oracle-cloud-free-tier-changes-2026)

**Job data and platform rules**
- [fantastic.jobs: ATS platforms with public job APIs](https://fantastic.jobs/article/ats-with-api)
- [HN Search API](https://hn.algolia.com/api)
- [Remotive jobs API (GitHub)](https://github.com/remotive-com/remote-jobs-api)
- [JobsPipe: free job APIs in 2026](https://jobspipe.dev/blog/free-job-api)
- [LinkedIn Help: automated activity](https://www.linkedin.com/help/linkedin/answer/90586)
- [Naukri.com terms](https://www.naukri.com/termsconditions)
- [Gemini API terms](https://ai.google.dev/terms)
