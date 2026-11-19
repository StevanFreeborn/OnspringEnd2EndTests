# Architecture & Design Standards

This document describes the design patterns and structural rules for the end-to-end test suite.

## The Screenplay Pattern

Tests use a streamlined Screenplay pattern adapted for [Playwright](https://playwright.dev).

Instead of organizing tests around pages, tests center on **Actors**, their **Abilities**, and the **Tasks** they perform.

```txt
Actor ("Who")
  │
  ├── Has Abilities (e.g., BrowseTheWeb)
  │     └─ Holds the driver (Playwright Page)
  │
  ├── Performs Tasks ("What happens")
  │     └─ Composable functions of user intent
  │
  └── Uses Targets ("Where")
        └─ Stateless locator functions
```

### Core Primitives

| Primitive     | Role                                                            | Signature                                                                              |
| :------------ | :-------------------------------------------------------------- | :------------------------------------------------------------------------------------- |
| **Actor**     | The persona running the test. Holds state and abilities.        | `actor.attemptsTo(...tasks)`<br>`actor.asks(question)`<br>`actor.browse()`             |
| **Ability**   | Gives the actor access to an automation tool. Wraps the driver. | `BrowseTheWeb.using(page)`                                                             |
| **Task**      | A business action or command causing a state change.            | `type Task<TActor> = (actor: TActor) => Promise<void>`                                 |
| **Question**  | A query retrieving data or inspecting application state.        | `type Question<TActor, TAnswer> = (actor: TActor) => Promise<TAnswer>`                 |
| **Target**    | A function resolving a locator from a page.                     | `type Target = Locator \| ((page: Page) => Locator)`                                   |
| **Action**    | A low-level browser interaction on the ability.                 | `actor.browse().click(target)`<br>`actor.browse().type(target, val)`                   |
| **Assertion** | Web-first, retrying validations via Playwright matchers.        | `actor.browse().check(target).isVisible()`<br>`actor.browse().checkPage().hasUrl(...)` |

### Adaptation for Playwright

Classical Screenplay creates separate classes for every action (`Click.on(...)`) and question (`actor.asks(...)`).

Playwright locators already auto-wait, and its `expect` matchers already retry. We keep the design lean:

1. Low-level actions live directly on the ability: `actor.browse().click(target)`.
2. Assertions wrap Playwright's `expect` matchers directly: `actor.browse().check(target)...`.
3. Commands that cause state changes are modeled as `Task<TActor>` and performed via `actor.attemptsTo(...)`.
4. Retrying task sequences (e.g. eventual consistency verification loops) are wrapped using `Retry.until(tasks, options)`.
5. Queries that extract values from the UI for external use (e.g. reading DNS keys for an external API) are modeled as `Question<TActor, TAnswer>` and asked via `actor.asks(...)`.

## System Layers

Dependencies flow down, never up:

```txt
[ Test Specs ]
      │
      ▼
[ Test Fixtures ]
      │
      ▼
[ Domain UI & Tasks ] ────► [ Domain Models & Factories ]
      │                              ▲
      ▼                              │
[ Automation Adapters ] ─────────────┘
      │
      ▼
[ Core Screenplay Abstractions ]
```

### Layer Roles

1. **Core Screenplay**: Base interfaces (`Actor`, `Ability`, `Task`). No external dependencies.
2. **Automation Adapters**: Driver-specific abilities (e.g., Playwright). Wraps `Page` and hosts browser actions and assertions.
3. **Domain Models & Factories**: Entities and test data generators. No UI or browser logic.
4. **Domain UI & Tasks**: Feature targets and user workflows.
5. **Test Fixtures**: Test setup, persona creation, and teardown.
6. **Test Specs**: Scenarios written from user perspective.

## Design Rules

### Encapsulate the Driver

The driver (`Page`) is private to `BrowseTheWeb`. Specs and tasks never touch it directly.

```typescript
// Bad: Leaks the driver
await actor.page.click('#save');

// Good: Uses the ability and a target
await actor.browse().click(Targets.saveButton);
```

### Curry Parameterized Targets

Targets resolve locators from a `Page`. If a target needs arguments, accept those first:

```typescript
// Bad: Driver passed as first parameter
const row = (page: Page, name: string) => page.getByRole('row', { name });

// Good: Curried function returning Target
const row =
  (name: string): Target =>
  (page: Page) =>
    page.getByRole('row', { name });

// Usage
await actor.browse().click(Targets.row('Example'));
```

### Treat Complex Widgets as Tasks

Do not build stateful component objects. Write reusable controls as tasks:

```typescript
await actor.attemptsTo(
  GridControl.selectRow({
    grid: Targets.grid,
    label: 'Example',
  })
);
```

### Use String Unions for UI States

When values map to labels or buttons, use string union types instead of enums:

```typescript
export type Status = 'Active' | 'Inactive' | 'Draft';

// Targets can use the value directly
const statusButton =
  (status: Status): Target =>
  (page: Page) =>
    page.getByRole('button', { name: status });
```

## Fixtures

Fixtures use static factory builders (`Fixture.create().with(...).build()`). They seed data, initialize the actor, and clean up after the test:

```typescript
export class EntityFixtureBuilder {
  private name?: string;

  withName(name: string): this {
    this.name = name;
    return this;
  }

  build() {
    return async ({ actor }: { actor: WebActor }, use: (entity: Entity) => Promise<void>) => {
      const entity = await createEntity(actor, this.name);
      try {
        await use(entity);
      } finally {
        await actor.attemptsTo(EntityTasks.delete(entity));
      }
    };
  }
}
```

## Workflows

- **Build packages**: `npm run build:packages`
- **Lint and typecheck**: `npm run lint`
- **Run tests**: `npm run test`
