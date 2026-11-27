# Contributing

This guide is the practical handbook for contributing tests, fixtures, and Screenplay building blocks to `OnspringEnd2EndTests`. Because the codebase evolves continuously, this document captures enduring patterns, boundaries, and entry points rather than static file inventories.

## Documentation

Each top-level document owns one concern:

| Document                                     | Responsibility                                                  |
| :------------------------------------------- | :-------------------------------------------------------------- |
| [README.md](README.md)                       | Environment setup, CLI commands, and CI workflows               |
| [docs/architecture.md](docs/architecture.md) | Conceptual Screenplay model, layer diagram, and core rules      |
| [CONTRIBUTING.md](CONTRIBUTING.md)           | Developer workflow, code placement, conventions, and guardrails |

Before creating new helpers, fixtures, or models, search the canonical entry points:

- **Domain models & fake data generators**: [packages/onspring-models/src/index.ts](packages/onspring-models/src/index.ts) and [fakeDataFactory.ts](packages/onspring-models/src/factories/fakeDataFactory.ts)
- **UI targets, tasks, questions, and shared controls**: [packages/onspring-ui/src/index.ts](packages/onspring-ui/src/index.ts)
- **Playwright actor, actions, assertions, and retry helper**: [packages/screenplay-playwright/src/index.ts](packages/screenplay-playwright/src/index.ts)
- **External testing services & utilities**: [packages/testing-services/src/index.ts](packages/testing-services/src/index.ts)
- **Test fixtures, tags, and annotations**: [fixtures/index.ts](fixtures/index.ts), [tests/tags.ts](tests/tags.ts), and [tests/annotations.ts](tests/annotations.ts)
- **Registered ESLint assertions**: [eslint.config.mjs](eslint.config.mjs)

## Where Does My Code Go?

Dependencies flow strictly downward. Lower layers must never import from higher layers or reach for Node/Playwright globals outside their boundary.

| Need                                                                                  | Destination                                            | Key Constraints                                                                                                                   |
| :------------------------------------------------------------------------------------ | :----------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| Core Screenplay types (`Actor`, `Ability`, `Task`, `Question`)                        | `packages/screenplay/src/`                             | Zero external dependencies; `"types": []`                                                                                         |
| Generic browser primitives, `TargetAssertions`, `PageAssertions`, `WebActor`, `Retry` | `packages/screenplay-playwright/src/`                  | Playwright adapter only; zero Onspring knowledge; `"types": []`                                                                   |
| Onspring domain entities, string-union types, `TEST_*` prefixes, `FakeDataFactory`    | `packages/onspring-models/src/`                        | Isomorphic TypeScript; zero Playwright or Node (`fs`, `path`) imports; `"types": []`                                              |
| Onspring selectors, page flows, shared UI controls, state queries                     | `packages/onspring-ui/src/`                            | Uses `@stevanfreeborn/screenplay-playwright` and `@stevanfreeborn/onspring-models`; `"types": []` (no `process`, `Buffer`, `env`) |
| Offline/Node integrations (Email/IMAP, SFTP, PDF, Excel, `.docx`, DNS, downloads)     | `packages/testing-services/src/`                       | Node-only (`"types": ["node"]`); declare runtime deps & subpath exports in `packages/testing-services/package.json`               |
| Test data seeding, persona wiring, `try/finally` teardown builders                    | `fixtures/`                                            | Fluent `*.fixtures.ts` builders re-exported via [fixtures/index.ts](fixtures/index.ts)                                            |
| Test scenarios                                                                        | `tests/<feature>/`                                     | Spec files (`*.spec.ts`) compose fixtures, `actor.attemptsTo(...)`, `actor.asks(...)`, and `actor.browse().check(...)`            |
| Tenant-wide test artifact sweeping                                                    | [cleanup/global.cleanup.ts](cleanup/global.cleanup.ts) | Invokes `deleteAllTest*` tasks via `sysAdminActor`                                                                                |

### Workspace Package Rules

- **ESM `.js` extensions**: All relative imports inside `packages/*/src/` **must** use explicit `.js` extensions (e.g., `import { WidgetTargets } from './widget.targets.js';`).
- **Rebuild before checking**: Tests and `tsconfig.json` consume compiled `dist/` outputs from each workspace package. Run `npm run build:packages` (or `npm run build:packages:clean`) after any edit under `packages/`.
- **Typecheck unit tests**: When modifying `screenplay`, `screenplay-playwright`, `onspring-models`, or `testing-services`, run `npm run test:packages`.

## Workflow for Adding a New Test

Follow this sequence top-to-bottom when adding coverage:

1. **Check existing building blocks** using the discovery entry points above.
2. **Add or extend domain models** in `packages/onspring-models/src/models/` and data generators/`TEST_*_NAME` constants in [fakeDataFactory.ts](packages/onspring-models/src/factories/fakeDataFactory.ts) if the feature introduces new entities. Re-export from `packages/onspring-models/src/models/index.ts`.
3. **Add browser primitives (rare)** in `packages/screenplay-playwright/src/` only if a generic Playwright interaction or assertion does not exist yet. If adding an assertion method on `TargetAssertions` or `PageAssertions`, add its method name to `playwright/expect-expect` -> `assertFunctionNames` in [eslint.config.mjs](eslint.config.mjs).
4. **Add UI targets, tasks, and questions** under `packages/onspring-ui/src/<domain>/` (`*.targets.ts`, `*.tasks.ts`, `*.questions.ts`) and re-export them from [packages/onspring-ui/src/index.ts](packages/onspring-ui/src/index.ts).
5. **Rebuild workspace packages** (`npm run build:packages`).
6. **Add or extend a fluent fixture** in `fixtures/<domain>.fixtures.ts` and re-export it from [fixtures/index.ts](fixtures/index.ts).
7. **Author the spec** in `tests/<domain>/<feature>.spec.ts`.
8. **Wire tenant cleanup** in [cleanup/global.cleanup.ts](cleanup/global.cleanup.ts) (`deleteAllTest*`) if the test creates a new top-level admin entity whose test fixture could leave orphans on an interrupted run.

## Core Patterns & Conventions

All examples below use an illustrative `Widget` pseudo-domain to show contracts and shapes without coupling to concrete UI markup.

### Targets (`*.targets.ts`)

- Keep all locator expressions and route/API path patterns inside `*.targets.ts` (or `packages/onspring-ui/src/common/`).
- Parameterized targets must be curried functions returning `Target` (`(arg) => (page: Page) => Locator`).
- Prefer accessible queries (`getByRole`, `getByLabel`, `getByPlaceholder`, `getByTitle`) scoped inside semantic containers; avoid brittle positional indexes where a label or role exists.
- Scope iframe-backed dialogs using `FrameOwner` ([frameOwner.ts](packages/onspring-ui/src/common/controls/frameOwner.ts)) rather than repeating `frameLocator(...)` across tasks.

```ts
import { Locator, Page } from '@playwright/test';
import { Target } from '@stevanfreeborn/screenplay-playwright';

export const WidgetPageTargets = {
  route: '/Admin/Widget',
  savePathRegex: /\/Admin\/Widget\/\d+\/Edit/,
  nameInput: (page: Page): Locator => page.getByLabel('Name'),
  saveButton: (page: Page): Locator => page.getByRole('link', { name: 'Save Changes' }),
  rowByName:
    (name: string | RegExp): Target =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name }).first(),
};
```

### Tasks (`*.tasks.ts`) & Questions (`*.questions.ts`)

- **Tasks** represent business commands (`(args) => Task<WebActor>`). Compose lower-level tasks and `actor.browse()` calls; interact only with `Target` objects, never raw `Locator` or `Page` escape hatches.
- **Questions** read state without side effects (`(args) => Question<WebActor, TAnswer>`).
- **Avoid circular runtime imports**: If a question needs simple clicks (e.g., opening a menu) and a task imports that question module, let the question invoke `actor.browse().click(Targets.*)` directly rather than importing `*.tasks.ts` back into `*.questions.ts`.

```ts
import { Response } from '@playwright/test';
import { Question, Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { WidgetPageTargets } from './widget.targets.js';

export const WidgetQuestions = {
  currentName:
    (): Question<WebActor, string> =>
    async (actor: WebActor): Promise<string> =>
      actor.browse().inputValue(WidgetPageTargets.nameInput),
};

export const WidgetTasks = {
  rename:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const saveResponse = actor
        .browse()
        .waitForResponse((r: Response) => WidgetPageTargets.savePathRegex.test(r.url()) && r.status() === 200);
      await actor.browse().fill(WidgetPageTargets.nameInput, name);
      await actor.browse().click(WidgetPageTargets.saveButton);
      await saveResponse;
    },
};
```

### Strict Driver Encapsulation & Assertions

- **Do**: Assert all DOM, form, dialog, and page URL state exclusively via `await actor.browse().check(target)...` (`isVisible`, `isHidden`, `isChecked`, `isNotChecked`, `hasValue`, `hasText`, `containsText`, etc.) and `await actor.browse().checkPage()...` (`hasUrl`, `doesNotHaveUrl`).
- **Don't**: Expose `page`, `context`, or raw `Locator` to specs or fixtures, wrap a target in raw Playwright `expect(locator)`, or create a `Question` that snapshots DOM form fields/text into a DTO solely to run synchronous `expect(...)` in a spec (that drops Playwright auto-retry).
- **When `expect(...)` belongs in specs**: Reserve `expect(...)` (imported from `../../fixtures`) for non-DOM outputs (parsed PDFs, Excel sheets, IMAP emails, HTTP API responses), multi-item array/ordering invariants, `expect(async () => ...).toPass(...)`, or extracted scalar values needed by subsequent steps (such as an entity ID or generated URL).

### Fluent Fixtures (`fixtures/<domain>.fixtures.ts`)

- Model reusable fixtures with static `.create()` builders and `try / finally` cleanup.
- **Playwright static parameter-destructuring rule**: Playwright inspects fixture function parameter destructuring statically to wire dependencies. Never declare optional sibling parameters unless the caller opted into them - branch inside `build()` to return a function whose destructured parameters match only what was configured.
- **Hook vs test-fixture ordering**: Playwright initializes fixtures destructured in `test.beforeEach` first, runs `test.beforeEach`, and only then initializes extra test-scoped fixtures (such as a `user` or `role` fixture that navigates `sysAdminActor` away to create entities). Do not assume `sysAdminActor` is still on the URL from `beforeEach` when the test itself also requests extra setup fixtures.

```ts
export class WidgetFixtureBuilder<TDeps extends { sysAdminActor: WebActor } = { sysAdminActor: WebActor }> {
  private name?: string;
  private parentFactory?: (deps: { app: App }) => string;

  withName(name: string): this {
    this.name = name;
    return this;
  }

  withParentApp(factory: (deps: { app: App }) => string): WidgetFixtureBuilder<TDeps & { app: App }> {
    this.parentFactory = factory;
    return this as unknown as WidgetFixtureBuilder<TDeps & { app: App }>;
  }

  build(): (deps: TDeps, use: (widget: Widget) => Promise<void>) => Promise<void> {
    const parentFactory = this.parentFactory;

    if (parentFactory) {
      return (async ({ sysAdminActor, app }: { sysAdminActor: WebActor; app: App }, use) => {
        // Seed & cleanup using `parentFactory({ app })`
      }) as unknown as (deps: TDeps, use: (widget: Widget) => Promise<void>) => Promise<void>;
    }

    return (async ({ sysAdminActor }: { sysAdminActor: WebActor }, use) => {
      // Seed & cleanup without requiring `app`
    }) as (deps: TDeps, use: (widget: Widget) => Promise<void>) => Promise<void>;
  }
}
```

### Spec Structure (`tests/<domain>/<feature>.spec.ts`)

- Extend base `test` from `../../fixtures` for test-scoped fixtures; import `expect` from `../../fixtures` only for non-DOM / extracted-value assertions or `expect(async () => ...).toPass(...)`. Use `actor.browse().check(...)` and `actor.browse().checkPage()` for all DOM and URL checks.
- Annotate every test with `AnnotationType.TestId` ([annotations.ts](tests/annotations.ts)) and apply `Tags` ([tags.ts](tests/tags.ts)) when needed (`Tags.NotFedRAMP`, `Tags.Snapshot`).
- Structure the scenario in clear `await test.step('...', async () => { ... })` blocks written in user-intent language.

```ts
import { FakeDataFactory, Widget } from '@stevanfreeborn/onspring-models';
import { WidgetPageTargets, WidgetTasks } from '@stevanfreeborn/onspring-ui';
import { test as base, WidgetFixture } from '../../fixtures';
import { AnnotationType } from '../annotations';

const test = base.extend<{ widget: Widget }>({
  widget: WidgetFixture.create().build(),
});

test.describe('widget', () => {
  test('Update a widget name', async ({ sysAdminActor, widget }) => {
    test.info().annotations.push({ type: AnnotationType.TestId, description: 'Test-000' });
    const updatedName = FakeDataFactory.createFakeAppName();

    await test.step('Rename the widget', async () => {
      await sysAdminActor.attemptsTo(WidgetTasks.rename(updatedName));
    });

    await test.step('Verify the updated name persists', async () => {
      await sysAdminActor.browse().check(WidgetPageTargets.nameInput).hasValue(updatedName);
    });
  });
});
```

### TypeScript Style

- Use `type` rather than `interface` for option shapes and domain types across packages, fixtures, and specs.
- Use string union types rather than `enum` when values map directly to UI labels.
- Keep `import type` / `export type` clean (`tsconfig.base.json` enforces `isolatedModules`, `noUnusedLocals`, and `noUnusedParameters`).
- Leave Playwright ESLint rules enabled; if a genuine edge case requires a rule override or timeout wait in infrastructure, keep it isolated inside `packages/screenplay-playwright` or a named task helper rather than inside `.spec.ts` files.

## Reliability, Parallelism, & Platform Guardrails

### Synchronization

- **Never use `networkidle`** (`playwright/no-networkidle` is an ESLint error). Wait for explicit API responses (`waitForResponse`) or UI state transitions (`waitForState`, `waitForDetached`, web-first `check(...)`).
- **Paginated Kendo grids**: Wrap scrolling/deletion with `KendoGridTasks` ([kendoGrid.ts](packages/onspring-ui/src/common/controls/kendoGrid.ts)) rather than querying raw `.k-pager-info` elements manually.
- **Eventual consistency**: Wrap asynchronous backend verification (IMAP email arrival, scheduled connector runs, iframe JS binding) in `Retry.until(...)` with explicit timeouts and `test.slow()` where appropriate.
- **Persisted grid filters**: Check session/grid state before re-selecting dropdown values when repeated navigation can retain prior filter state and suppress expected XHR reloads.

### Test Isolation & Parallel Execution

- Always generate unique resource names with `FakeDataFactory` so parallel workers never collide.
- Clean up resources created during a test in fixtures (`try / finally`) or `test.afterEach`, and prefer `sysAdminActor` only when administrative setup or shared non-conflicting navigation is needed.
- **User-scoped server state**: Actions that mutate server-side per-user preferences or "last visited" session state (for example, navigating `/Dashboard/{id}`) can race across workers sharing `sysAdminActor`. Isolate per-user tests with `UserFixture.create().withStatus('Active').build()` + `ActorFixture.forUser().build()`, or navigate explicitly by entity ID.

### Environment & Browser Guardrails

- **FedRAMP exclusions**: Tag features unavailable in FedRAMP with `Tags.NotFedRAMP` and skip conditionally via `test.skip(environment.isFedspring(), ...)`.
- **Factory configuration**: Root [fixtures/index.ts](fixtures/index.ts) configures `FakeDataFactory` from environment settings so generated user emails route to the test inbox. Do not hardcode environment URLs or credentials anywhere in tests or packages.
- **Visual baselines**: Match the CI Linux snapshot environment with Docker when updating `@snapshot` baselines (see [README.md](README.md)).
- **Sequential local runs**: Run `--project chrome` and `--project edge` **sequentially**, never at the same time (concurrent browser projects race `.auth/sysAdmin.json` setup/teardown), and prefer `--workers 2` locally to avoid overloading target instances.

## Pre-PR Verification & Commit Checklist

Before opening a pull request or requesting review, verify the full local stack in order:

1. Clean build all packages (required whenever `packages/*` changed):

   ```sh
   npm run build:packages:clean
   ```

2. Run package unit tests:

   ```sh
   npm run test:packages
   ```

3. Format check, typecheck, and zero-warning lint:

   ```sh
   npm run format:test && npm run lint
   ```

4. Run affected specs sequentially against both browsers:

   ```sh
   npx playwright test <path-to-spec> --project chrome --workers 2
   npx playwright test <path-to-spec> --project edge --workers 2
   ```

5. Confirm git diffs are atomic using conventional commits (for example: `feat(screenplay): ...`, `feat(fixtures): ...`, `test(<domain>): ...`, `fix(<scope>): ...`, `chore: ...`).
