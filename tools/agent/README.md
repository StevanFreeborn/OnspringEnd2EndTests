# Onspring Agent CLI

Strict TypeScript CLI (`tools/agent/src/cli.ts`, compiled to `tools/agent/dist/cli.js`) powered by the repository's existing `typescript` compiler API and `dotenv` to help any coding agent discover existing Screenplay primitives, search local Help Center Markdown docs, explore the live Onspring UI, and verify architectural guardrails.

## Build

`tools/agent` compiles alongside the workspace packages (`npm run build:packages`) or standalone:

```sh
npm run build:agent
```

## Usage

Run via `npm run agent -- <command>` or directly with Node (`node tools/agent/dist/cli.js <command>`):

```sh
npm run agent -- catalog --domain apps
npm run agent -- help-search "survey designer" --top 5
npm run agent -- explore --route /Admin/App
npm run agent -- verify tests/apiKey/apiKey.spec.ts
```

### Subcommands

- `catalog`: Uses the TypeScript AST to extract exported Targets, Tasks, Questions, Controls, Models, `FakeDataFactory` helpers, Fixtures, Tags, and Annotations.
- `help-search`: Ranks Markdown sections from `--docs-dir` or `ONSPRING_HELP_DOCS_DIR` using BM25 + heading weighting.
- `explore`: Resolves `TEST_ENV` + `<TEST_ENV>_INSTANCE_URL`, creates/persists `.auth/sysAdmin.json` (`KEEP_AUTH_STATE=true`) if missing or `--refresh-auth`, and prints/launches pre-authenticated `playwright-cli` commands.
- `verify`: Runs `build:packages:clean`, `test:packages`, `format:test`, `tsc --noEmit`, `eslint --max-warnings 0 .`, TypeScript AST Screenplay architecture guardrails, and optional sequential Chrome (`--workers 2 --repeat-each 2`) + Edge (`--workers 2`) E2E tests.

### Environment Variables

- `ONSPRING_HELP_DOCS_DIR`: Optional path to your local Onspring Help Center Markdown directory (used by `help-search` unless `--docs-dir` is passed).
