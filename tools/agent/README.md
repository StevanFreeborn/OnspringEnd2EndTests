# Onspring Agent CLI

Strict TypeScript CLI (`tools/agent/src/cli.ts`, compiled to `tools/agent/dist/src/cli.js`) powered by the repository's existing `typescript` compiler API and `dotenv` to help any coding agent discover existing Screenplay primitives, search local Help Center Markdown docs, explore the live Onspring UI, and verify architectural guardrails.

## Build & Test

`tools/agent` compiles alongside the workspace packages (`npm run build:packages` / `npm run build:packages:clean`) or standalone:

```sh
npm run build:agent
npm run test:agent
npm run clean:agent
```

## Usage

Run via `npm run agent -- <command>` or directly with Node (`node tools/agent/dist/src/cli.js <command>`):

```sh
npm run agent -- catalog --domain apps
npm run agent -- help-search "survey designer" --top 5
npm run agent -- explore --route /Admin/App --script ./explore-temp.js
npm run agent -- verify tests/survey/surveyCampaign.spec.ts
npm run agent -- runners
npm run agent -- run --brief "Test-678 Add a new public campaign" --domain survey --runner agy
```

### Subcommands

- `catalog`: Uses the TypeScript AST to extract exported Targets, Tasks, Questions, Controls, Models, `FakeDataFactory` helpers, Fixtures, Tags, and Annotations.
- `help-search`: Strips YAML frontmatter while indexing `title`/`summary`, ranking Markdown sections from `--docs-dir` or `ONSPRING_HELP_DOCS_DIR` using BM25 + heading weighting.
- `explore`: Resolves `TEST_ENV` + `<TEST_ENV>_INSTANCE_URL`, creates/refreshes `.auth/sysAdmin.json` (`KEEP_AUTH_STATE=true`, auto-refreshing when older than `--max-age` minutes, default `45`), and either prints/launches `playwright-cli` commands or runs `--script <file.js>` in a single `try / finally` session.
- `verify`: Runs `build:packages:clean`, `test:packages`, `format:test`, `tsc --noEmit`, `eslint --max-warnings 0 .`, TypeScript AST Screenplay architecture guardrails, and sequential Chrome (`--workers 2 --repeat-each 2`) + Edge (`--workers 2`) E2E tests (skipping Edge on Chrome failure unless `--no-fail-fast` is passed).
- `runners`: Detects which headless agent CLIs (`agy`, `opencode`, `copilot`, `claude`, `codex`) are installed on `PATH`.
- `run`: Orchestrates an autonomous test-authoring run in an isolated `.agent-worktrees/<slug>` worktree (linked `node_modules` by default, `--install` for `npm ci`, `--in-place` opt-out), executes the selected runner with pre-flight context, independently verifies changed specs with bounded retries (`--max-attempts 3`), writes run artifacts under `.agent-runs/`, and supports opt-in `--commit` and `--draft-pr`.

### Environment Variables

- `ONSPRING_HELP_DOCS_DIR`: Optional path to your local Onspring Help Center Markdown directory (used by `help-search` unless `--docs-dir` is passed).
