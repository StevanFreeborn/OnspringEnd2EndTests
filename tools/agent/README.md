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
npm run agent -- ingest --input ./backlog.csv --domain survey --json
npm run agent -- runners
npm run agent -- run --brief "Test-678 Add a new public campaign" --domain survey --runner agy
npm run agent -- run --input ./backlog.csv --shared-branch feat/campaign-tests --runner opencode --cleanup-worktree
```

### Subcommands

- `catalog`: Uses the TypeScript AST to extract exported Targets, Tasks, Questions, Controls, Models, `FakeDataFactory` helpers, Fixtures, Tags, and Annotations.
- `help-search`: Strips YAML frontmatter while indexing `title`/`summary`, ranking Markdown sections from `--docs-dir` or `ONSPRING_HELP_DOCS_DIR` using BM25 + heading coverage + phrase bigram weighting.
- `explore`: Resolves `TEST_ENV` + `<TEST_ENV>_INSTANCE_URL`, creates/refreshes `.auth/sysAdmin.json` (`KEEP_AUTH_STATE=true`, auto-refreshing when older than `--max-age` minutes, default `45`), executes `--script <file.js>` in a fast single Node Playwright process by default (`--engine node`, `--headed` optional), or prints/launches interactive `playwright-cli` commands (`--launch`, `--engine cli`).
- `verify`: Runs `build:packages:clean` (or incremental `build:packages` with `--no-clean`), `test:packages`, `format:test`, `tsc --noEmit`, `eslint --max-warnings 0 .`, TypeScript AST Screenplay architecture guardrails, and sequential Chrome (`--workers 2 --repeat-each 2`) + Edge (`--workers 2`) E2E tests (skipping Edge on Chrome failure unless `--no-fail-fast` is passed), streaming per-stage `[verify]` progress on `stderr` unless `--quiet` is passed.
- `ingest`: Parses and normalizes single or batch test briefs from Markdown (`.md`), RFC-4180 CSV (`.csv`), JSON (`.json`), YAML (`.yml`/`.yaml`), GitHub Issues (`gh` CLI via `--issue`/`--label`/`--query`), or Onspring v2 REST API (`--record-id`, `--app-id [--filter]`, or `--report-id` with `--onspring-config` / `--field-map`). Unchecked `- [ ] Test-NNN` task-checklist items in Markdown and GitHub issues automatically expand into individual briefs (skipping completed `- [x]` items); prints an aligned summary table by default (pass `--markdown` for full rendered briefs or `--json` for raw JSON).
- `runners`: Detects which headless agent CLIs (`agy`, `opencode`, `copilot`, `claude`, `codex`) are installed on `PATH`.
- `run`: Orchestrates single or batch autonomous test-authoring runs from `--brief`, `--brief-file`, or any `ingest` source in isolated `.agent-worktrees/<slug>` worktrees (default one branch/worktree per brief, `--shared-branch <name>` to stack passing tests sequentially with prior-commit handoff context, and `--resume` to skip already-implemented `Test-NNN` cases on a shared branch), shows a compact live spinner + condensed status in the terminal by default (writing full raw logs to `.agent-runs/`, or pass `--verbose` for a dimmed-gutter raw stream and `--quiet` to suppress progress), independently verifies changed specs with bounded retries (`--max-attempts 3`, including Playwright `error-context.md` snapshots on E2E failures), writes consolidated `.agent-runs/` reports with attempt counts and timing telemetry, and supports opt-in `--commit` and `--draft-pr`.

### Environment Variables

- `ONSPRING_HELP_DOCS_DIR`: Optional path to your local Onspring Help Center Markdown directory (used by `help-search` unless `--docs-dir` is passed).
- `ONSPRING_CORP_API_URL`, `ONSPRING_CORP_API_KEY`, `ONSPRING_CORP_CONFIG`: Optional Onspring REST API v2 base URL, API key, and default JSON field/column mapping config path for the `onspring` adapter.

Example Onspring field-mapping JSON (`--onspring-config`):

```json
{
  "appId": 100,
  "reportId": 250,
  "fields": {
    "testId": 1001,
    "title": 1002,
    "domain": 1003,
    "preconditions": 1004,
    "steps": 1005,
    "assertions": 1006,
    "cleanup": 1007
  },
  "columns": {
    "testId": "Test ID",
    "title": "Name",
    "assertions": "Expected Result"
  }
}
```
