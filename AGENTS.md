# AGENTS.md

Repository instructions for AI coding agents working in `OnspringEnd2EndTests`.

## Authoritative Documentation

Read these before making changes:

- Architecture concepts & layer rules: [docs/architecture.md](docs/architecture.md)
- Developer guide, conventions, and guardrails: [CONTRIBUTING.md](CONTRIBUTING.md)
- Agent test-authoring workflow skill: [.agents/skills/author-onspring-test/SKILL.md](.agents/skills/author-onspring-test/SKILL.md)

## Agent CLI (`tools/agent/src/cli.ts`)

Prefer the deterministic TypeScript CLI over manual grep when authoring or verifying tests (compiled via `npm run build:packages` or `npm run build:agent`; invoked with `npm run agent -- ...` or `node tools/agent/dist/src/cli.js ...`):

- Discover existing Targets, Tasks, Questions, Controls, Models, and Fixtures:
  `npm run agent -- catalog [--domain <name>] [--kind all|targets|tasks|questions|controls|models|fixtures|tags] [--json]`
- Search local Onspring Help Center Markdown docs (`ONSPRING_HELP_DOCS_DIR`):
  `npm run agent -- help-search "<query>" [--top 5] [--json]`
- Prepare/launch pre-authenticated browser exploration or execute a script via `playwright-cli`:
  `npm run agent -- explore --route /Admin/App [--refresh-auth] [--max-age 45] [--launch] [--script <file.js>]`
- Run full verification (package builds, unit tests, Prettier, TypeScript, zero-warning ESLint, Screenplay guardrails, and sequential fail-fast Chrome/Edge E2E):
  `npm run agent -- verify [spec-path] [--skip-e2e] [--no-fail-fast] [--repeat 2] [--json]`
- List available headless agent CLIs or orchestrate an isolated worktree run with bounded self-heal:
  `npm run agent -- runners [--json]`
  `npm run agent -- run (--brief "<text>" | --brief-file <path>) [--runner agy|opencode|copilot|claude|codex|custom] [--domain <name>] [--dry-run]`

## Non-Negotiable Architecture Rules

1. **Strict downward layers**: `tests/` -> `fixtures/` -> `packages/onspring-ui` -> `packages/screenplay-playwright` & `packages/onspring-models` -> `packages/screenplay`. Never import upward or skip layers cleanly designed in [CONTRIBUTING.md](CONTRIBUTING.md).
2. **Browser / isomorphic package rules**: Inside `packages/screenplay`, `packages/screenplay-playwright`, `packages/onspring-models`, and `packages/onspring-ui`, all relative imports **must** end with `.js`, and `tsconfig.json` keeps `"types": []` (zero Node globals or `env.ts` imports).
3. **Zero raw Playwright in specs or non-auth fixtures**: Never expose `page`, `context`, or raw `Locator` in `tests/` (except `tests/api/`) or `fixtures/` (except `fixtures/auth.fixtures.ts`). Interact strictly via `actor.attemptsTo(...)`, `actor.asks(...)`, and `actor.browse().check(...)`.
4. **Never guess selectors or routes**: Always inspect the live UI via `explore` + `playwright-cli` snapshots (or inspect existing targets/pages) before writing `*.targets.ts`.
5. **Re-export & rebuild**: Re-export every new UI module from `packages/onspring-ui/src/index.ts`, every new model from `packages/onspring-models/src/models/index.ts`, and every new fixture from `fixtures/index.ts`. Run `npm run build:packages` after package edits.
6. **TypeScript & test hygiene**: Prefer `type` over `interface`, generate unique test data via `FakeDataFactory`, annotate every test with `AnnotationType.TestId`, never use `networkidle` or `test.only`, and close any `playwright-cli` browser sessions when finished.
7. **Sequential Playwright execution**: Run `--project chrome` and `--project edge` **sequentially** with `--workers 2`, never concurrently.
8. **Git safety**: Never commit changes or leak `.env` secrets unless explicitly instructed.
