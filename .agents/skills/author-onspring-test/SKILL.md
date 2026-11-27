---
name: author-onspring-test
description: Authors compliant Screenplay E2E tests, fixtures, UI targets/tasks/questions, and models in OnspringEnd2EndTests by discovering existing helpers, searching local Help Center Markdown docs, exploring the live Onspring UI via playwright-cli, and verifying guardrails.
---

# Author an Onspring Screenplay Test

Follow this 6-step workflow in order whenever turning a test description into Screenplay code in `OnspringEnd2EndTests`.

Read [CONTRIBUTING.md](../../../CONTRIBUTING.md) first if you need syntax examples for targets, tasks, questions, fluent builders, or specs.

---

## Step 1: Normalize the Test Brief

Extract the test input (pasted prose, Markdown, CSV row, GitHub issue, or Onspring record) into the structured schema in [references/test-brief-template.md](references/test-brief-template.md).

Identify:

- **Test ID** (for `AnnotationType.TestId`) and concise user-intent **Title**
- **Feature Domain** (e.g., `app`, `survey`, `report`, `dashboard`, `fields`, `triggers`, `user`, `role`, `sharedLists`)
- **Required Tags** (`Tags.NotFedRAMP` if unavailable in FedRAMP, `Tags.Snapshot` if visual comparison)
- **Actor Persona**: Does the test need `sysAdminActor` or an isolated non-admin/newly created `UserFixture` + `ActorFixture.forUser()` (mandatory whenever mutating per-user session/preference state)?
- **Preconditions / Seed Data**, **Action Steps**, **Expected Assertions**, and **Cleanup Needs**

If a detail is ambiguous, note it and resolve Step 2–4 before inventing assumptions.

---

## Step 2: Discover Existing Building Blocks (`catalog`)

Never recreate a Target, Task, Question, Control, Model, or Fixture that already exists.

Run:

```sh
npm run agent -- catalog --domain <domain>
npm run agent -- catalog --kind fixtures
npm run agent -- catalog --kind controls
```

Inspect relevant returned files in `packages/onspring-ui/src/`, `packages/onspring-models/src/`, and `fixtures/` to confirm signatures and reuse opportunities.

---

## Step 3: Search Local Help Center Docs (`help-search`)

When `ONSPRING_HELP_DOCS_DIR` is configured, look up official Onspring terminology, navigation paths, required permissions, and edge cases before guessing UI behavior:

```sh
npm run agent -- help-search "<feature keywords>" --top 5
```

If Help Center docs are not configured locally, proceed cleanly to live UI exploration in Step 4.

---

## Step 4: Explore the Live Onspring UI (`explore` + `playwright-cli`)

Never guess selectors, URLs, labels, or API response paths. Inspect the real page:

1. Run a single-command pre-authenticated exploration script (automatically refreshes `.auth/sysAdmin.json` if missing or stale, runs `open` -> `state-load` -> `goto` -> `playwright-cli run-code --filename` -> `close` safely inside `try / finally`):

   ```sh
   npm run agent -- explore --route /Admin --script path/to/explore-script.js
   ```

   Or print/launch an interactive session with `npm run agent -- explore --route /Admin [--launch]`.

2. Navigate to the feature area, click/fill through the scenario manually, and inspect accessibility snapshots + XHR/network endpoints (to find real `waitForResponse` URL regexes rather than timeouts).
   - Prefer `--script <temp-script.js>` (`playwright-cli run-code --filename=...`) for multi-step UI/iframe/XHR exploration rather than long inline shell arguments, and clean up temporary script files when finished.
3. Close any open browser sessions when exploration completes (`playwright-cli close` or `close-all`).

---

## Step 5: Implement Bottom-Up

Follow layer boundaries strictly downward:

1. **Domain models & fake data (`packages/onspring-models/src/`)**: Add/extend models (`*.ts` re-exported from `src/models/index.ts`) or `FakeDataFactory` generators / `TEST_*` constants only if missing. Use `.js` on relative imports. Zero Playwright or Node imports.
2. **Screenplay UI layer (`packages/onspring-ui/src/<domain>/`)**:
   - Prefer accessible selectors (`getByRole`, `getByLabel`, `getByPlaceholder`, `getByTitle`) in `*.targets.ts`, scoped via semantic containers or `FrameOwner` for iframe dialogs.
   - Implement `*.tasks.ts` (`Task<WebActor>`) and `*.questions.ts` (`Question<WebActor, TAnswer>`) without creating circular imports between questions and tasks.
   - Export all new modules from `packages/onspring-ui/src/index.ts`.
   - Use `.js` extensions on all relative imports; keep `"types": []` clean; prefer `type` over `interface`.
3. **Rebuild workspace packages**:

   ```sh
   npm run build:packages
   ```

4. **Fluent fixtures (`fixtures/<domain>.fixtures.ts`)**:
   - Extend/add a builder using `try / finally` cleanup and static Playwright destructuring branches inside `build()`.
   - Re-export from `fixtures/index.ts`.
5. **Spec (`tests/<domain>/<feature>.spec.ts`)**:
   - Extend `test` from `../../fixtures`.
   - Push `AnnotationType.TestId` annotation inside each test.
   - Avoid test titles starting with `"Test "` (e.g., `"Verify a public campaign in test mode"` instead of `"Test a public campaign"`), which trips ESLint's `playwright/valid-title` rule.
   - Compose `await test.step(...)` blocks using `actor.attemptsTo(...)`, `actor.asks(...)`, and `actor.browse().check(...)`.
   - Zero raw `page.` / `.locator(` / `networkidle` / `test.only`.
6. **Tenant cleanup (`cleanup/global.cleanup.ts`)**: Wire a `deleteAllTest*` sweep if the test creates a new top-level admin entity that could be orphaned on an interrupted run.

---

## Step 6: Verify & Bounded Self-Heal (`verify`)

Run the unified verification gate:

```sh
npm run agent -- verify <path/to/new.spec.ts>
```

(`--skip-e2e` runs static checks only during intermediate edits; final verification must run E2E sequentially against both Chrome (`--workers 2 --repeat-each 2`) and Edge (`--workers 2`) unless `--skip-e2e` was explicitly requested because no target instance is available.)

**Bounded self-heal rule (max 3 attempts):**

- If build, package tests, Prettier, TypeScript, ESLint, architecture guardrails, or E2E fails, fix the issue and re-run `verify`.
- If E2E still fails after 3 fix attempts—or fails due to an application bug / environment outage rather than selector/timing code—stop, capture the failure output, and report clearly instead of weakening assertions or adding `waitForTimeout`.

**Before concluding:**

- Ensure `playwright-cli` sessions are closed and `.env` secrets were never echoed.
- Leave changes **uncommitted** unless explicitly asked to commit.
