# Backlog

Candidate projects, taken from the three research files in [research/](research/). Nothing
here is built yet. Pick one, then follow [how-to-build-a-project.md](how-to-build-a-project.md).

## Suggested order (my call, change it freely)

1. **Repo CI for this repo**: run `npm test` on every push with GitHub Actions. It's small,
   makes every later PR safer, and is #1 in the backend research.
2. **One track to start with.** Each track has its own research file:

| Track | First build | Research |
|---|---|---|
| A. Money: automations for small businesses | Missed-call text-back + instant lead reply (`missed-call-textback.json`) | [money-projects.md](research/money-projects.md) |
| B. Personal: reach-out copilot (n8n + Obsidian) | Phase 0 spikes, then phase 1 paste-in copilot (`people-inbound.json`) | [reach-out-copilot.md](research/reach-out-copilot.md) |
| C. Developer and job-hunt automations | J1 job radar + J2 tracker (n8n), after CI | [backend-automation-projects.md](research/backend-automation-projects.md) |

## Track A: money projects (ranked in research)

| # | Project | Notes |
|---|---|---|
| A1 | Missed-call text-back + instant lead reply | Best evidence; start here |
| A2 | Review-request automation | Upsell to A1 clients |
| A3 | Invoice and payment follow-up | B2B service firms |
| A4 | AI receptionist / booking back office | Higher cost (voice) |
| A5 | E-commerce revenue flows | |
| A6 | Lead-generation engine | For your own prospecting |
| A7 | Content repurposing pipeline | |
| A8 | Database reactivation | Highest legal risk (TCPA) |
| A9–A11 | Freelance builds, micro-SaaS, affiliate | Weak evidence |

Clients need a public HTTPS host (a VPS or n8n Cloud), not the local Docker.

## Track B: reach-out copilot (phases from research)

| Phase | Build | Workflows |
|---|---|---|
| 0 | Prove the risky parts: vault mount, Ollama on RX 580, Groq limits, Telegram bot | spikes |
| 1 | Paste-in copilot: classify + draft | `people-inbound`, `llm-gateway` |
| 2 | Memory: facts, connections, events | `people-memory` |
| 3 | Daily digest | `people-digest` |
| 4 | Direct channels: Telegram, Gmail drafts | `telegram-poller`, `people-approve` |
| 5 | Optional `auto` mode | — |

**Open decisions before phase 1** (from research): where most conversations happen; whether
`draft` is OK as the default; country; existing or new vault; texting languages.

## Track C: developer and job-hunt (personal order from research)

| Week | Build | Lives in |
|---|---|---|
| 1 | #1 CI + #2 secret/dependency protection; #14 service template | GitHub config / template repos |
| 2 | J1 job radar + J2 tracker | **here** (n8n) |
| 3 | #3 agent setup + #4 PR review | GitHub / optional n8n |
| 4 | #6 observability + J4 deadlines | **here** (n8n) |
| 5 | #5 tests/flaky + #12 digest + J3 tailor | here + CI |
| 6+ | #7, #9, #10, #8, #11, #13, J5, J6, #15 | mixed |

Only #6, #10, #12, #13, J1–J6 (and optionally #4, #5) belong in this repo. The rest live in
GitHub config or separate repos.
