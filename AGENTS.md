# AGENTS.md

Repository instructions for AI coding agents working in `OnspringEnd2EndTests`.

## Authoritative Documentation

Read these before making changes:

- Architecture concepts & layer rules: [docs/architecture.md](docs/architecture.md)
- Developer guide, conventions, and guardrails: [CONTRIBUTING.md](CONTRIBUTING.md)
- Agent test-authoring workflow skill: [.agents/skills/author-onspring-test/SKILL.md](.agents/skills/author-onspring-test/SKILL.md)

## Stagehand CLI (`tools/stagehand/src/cli.ts`)

Prefer Stagehand over manual grep when authoring or verifying tests (compiled via `npm run build:packages` or `npm run build:stagehand`; invoked with `npm run stagehand -- ...` or `node tools/stagehand/dist/src/cli.js ...`):

- Discover existing Targets, Tasks, Questions, Controls, Models, and Fixtures:
  `npm run stagehand -- catalog [--domain <name>] [--kind all|targets|tasks|questions|controls|models|fixtures|tags] [--json]`
- Search local Onspring Help Center Markdown docs (`ONSPRING_HELP_DOCS_DIR`):
  `npm run stagehand -- help-search "<query>" [--top 5] [--json]`
- Prepare/launch pre-authenticated browser exploration or execute a script (direct Node Playwright by default, or `--engine cli` for `playwright-cli`):
  `npm run stagehand -- explore --route /Admin/App [--refresh-auth] [--max-age 45] [--launch] [--script <file.js>] [--engine node|cli]`
- Run full verification (package builds, unit tests, Prettier, TypeScript, zero-warning ESLint, Screenplay guardrails, and sequential fail-fast Chrome/Edge E2E):
  `npm run stagehand -- verify [spec-path] [--skip-e2e] [--no-fail-fast] [--no-clean] [--repeat 2] [--json]`
- List available headless runner CLIs, ingest briefs, or orchestrate single/batch runs:
  `npm run stagehand -- runners [--json]`
  `npm run stagehand -- ingest (--input <file> | --issue <num> | --label <name> | --record-id <id> | --report-id <id>) [--markdown] [--json]`
  `npm run stagehand -- run (--brief "<text>" | --brief-file <path> | --input <file> | --issue <num> | --record-id <id>) [--shared-branch <name>] [--resume] [--runner agy|opencode|copilot|claude|codex|custom] [--domain <name>] [--verbose] [--dry-run]`

## Non-Negotiable Architecture Rules

1. **Strict downward layers**: `tests/` -> `fixtures/` -> `packages/onspring-ui` -> `packages/screenplay-playwright` & `packages/onspring-models` -> `packages/screenplay`. Never import upward or skip layers cleanly designed in [CONTRIBUTING.md](CONTRIBUTING.md).
2. **Browser / isomorphic package rules**: Inside `packages/screenplay`, `packages/screenplay-playwright`, `packages/onspring-models`, and `packages/onspring-ui`, all relative imports **must** end with `.js`, and `tsconfig.json` keeps `"types": []` (zero Node globals or `env.ts` imports).
3. **Zero raw Playwright in specs or non-auth fixtures**: Never expose `page`, `context`, or raw `Locator` in `tests/` (except `tests/api/`) or `fixtures/` (except `fixtures/auth.fixtures.ts`). Interact strictly via `actor.attemptsTo(...)`, `actor.asks(...)`, and `actor.browse().check(...)`.
4. **Never guess selectors or routes**: Always inspect the live UI via `explore` + `playwright-cli` snapshots (or inspect existing targets/pages) before writing `*.targets.ts`.
5. **Re-export & rebuild**: Re-export every new UI module from `packages/onspring-ui/src/index.ts`, every new model from `packages/onspring-models/src/models/index.ts`, and every new fixture from `fixtures/index.ts`. Run `npm run build:packages` after package edits.
6. **TypeScript & test hygiene**: Prefer `type` over `interface`, generate unique test data via `FakeDataFactory`, annotate every test with `AnnotationType.TestId`, never use `networkidle` or `test.only`, and close any `playwright-cli` browser sessions when finished.
7. **Sequential Playwright execution**: Run `--project chrome` and `--project edge` **sequentially** with `--workers 2`, never concurrently.
8. **Git safety**: Never commit changes or leak `.env` secrets unless explicitly instructed.
