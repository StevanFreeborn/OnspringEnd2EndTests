# `@stevanfreeborn/screenplay-playwright`

Playwright adapter for `@stevanfreeborn/screenplay` providing `WebActor`, `BrowseTheWeb`, fluent `BrowserActions`, retrying web-first `TargetAssertions`, and `Retry.until`.

## Installation

```bash
npm install @stevanfreeborn/screenplay-playwright @playwright/test
```

## Usage

```ts
import { Page } from '@playwright/test';
import { Task, Target, WebActor } from '@stevanfreeborn/screenplay-playwright';

const submitButton: Target = (page: Page) => page.getByRole('button', { name: 'Submit' });

const submitForm = (): Task<WebActor> => async actor => {
  await actor.browse().click(submitButton);
  await actor.browse().check(submitButton).isHidden();
};

export async function run(page: Page): Promise<void> {
  const actor = WebActor.using('StandardUser', page);
  await actor.attemptsTo(submitForm());
}
```

## ESLint Note

If you use `eslint-plugin-playwright`, add `BrowserActions` / `TargetAssertions` assertion method names (e.g., `isVisible`, `hasText`, `hasUrl`) to `playwright/expect-expect`'s `assertFunctionNames` list.

## License

MIT
