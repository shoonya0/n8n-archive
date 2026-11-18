# How to build a project here

Every new or changed workflow follows the same path. The superpowers skills drive each step.
In Claude Code, just describe what you want and the matching skill runs, or name it
("use superpowers:brainstorming").

| # | Step | Skill | Output |
|---|---|---|---|
| 1 | Pick the next item from [backlog.md](backlog.md) and start a branch: `git fetch; git switch -c feature/<name> origin/main` | — | a clean branch |
| 2 | **Brainstorm**: what it's for, the webhook contract, and what counts as failure | `superpowers:brainstorming` | `_docs/specs/YYYY-MM-DD-<name>-design.md` (you approve it) |
| 3 | **Plan**: small steps, each with its test | `superpowers:writing-plans` | `_docs/plans/YYYY-MM-DD-<name>-plan.md` |
| 4 | **Red**: write `tests/integration/<name>.test.mjs` for the contract, run it, and watch it fail | `superpowers:test-driven-development` | a failing test |
| 5 | **Green**: build `workflows/<name>.json`, run `node scripts/deploy.mjs <name>.json`, and re-run until it passes | `superpowers:executing-plans` or `superpowers:subagent-driven-development` | a passing test |
| 6 | `npm test` passes (structure rules) | — | — |
| 7 | **Verify** with real output before saying it's done | `superpowers:verification-before-completion` | test output |
| 8 | Update [progress.md](progress.md); commit (Conventional Commits) | — | commit(s) |
| 9 | Review if it's non-trivial | `/code-review`, `superpowers:requesting-code-review` | findings fixed |
| 10 | Finish: push, open a PR, merge, delete the branch | `superpowers:finishing-a-development-branch` | merged into `main` |

When something breaks, use `superpowers:systematic-debugging` before changing code.

## Workflow JSON checklist

- `id`: 16 random alphanumeric chars, never reused
  (`node -e "console.log(require('crypto').randomBytes(12).toString('base64url').replace(/[-_]/g,'x').slice(0,16))"`)
- exactly one trigger; for a webhook trigger, a unique `path`, a `webhookId` (UUID) and
  `responseMode: responseNode`
- no secrets: use n8n credentials or `$env`
- outside APIs can be faked in tests (`$env.DRY_RUN` or a fake endpoint)

Use `workflows/hello-webhook.json` and `tests/integration/hello-webhook.test.mjs` as the
reference example (webhook → validate → respond 200 / 400).
