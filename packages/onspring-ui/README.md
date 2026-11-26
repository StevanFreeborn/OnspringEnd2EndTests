# `@stevanfreeborn/onspring-ui`

Onspring UI targets, Screenplay `Task`s, and `Question`s built on `@stevanfreeborn/screenplay-playwright` and `@stevanfreeborn/onspring-models`.

## Installation

```bash
npm install @stevanfreeborn/onspring-ui @playwright/test
```

## Architecture

Each UI domain exposes stateless targets, reusable tasks, and queries:

- `*.targets.ts`: Stateless locator functions (`Target`) and route/API path patterns.
- `*.tasks.ts`: Screenplay `Task<WebActor>` commands executed via `actor.attemptsTo(...)`.
- `*.questions.ts`: Screenplay `Question<WebActor, T>` queries executed via `actor.asks(...)`.
- `common/controls/`: Shared Kendo/Onspring widget tasks (`KendoGridTasks`, `DualPaneSelector`, `ReferenceFieldGrid`, `StatusSwitchTasks`, etc.).

## Usage

```ts
import { AuthTasks, SidebarNavTargets } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';

const sysAdmin = WebActor.using('SysAdmin', page);
await sysAdmin.attemptsTo(AuthTasks.login(username, password));
await sysAdmin.browse().check(SidebarNavTargets.usersFullName).hasText('System Admin');
```

## License

MIT
