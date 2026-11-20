import { Download, expect, Locator, Page, Response } from '@playwright/test';
import { Ability, Actor, Task } from '@stevanfreeborn/screenplay';

export type Target = Locator | ((page: Page) => Locator);

export function resolveTarget(page: Page, target: Target): Locator {
  return typeof target === 'function' ? target(page) : target;
}

/**
 * Ability that enables an Actor to interact with a browser via Playwright's Page.
 */
export class BrowseTheWeb implements Ability {
  readonly name = 'BrowseTheWeb';
  readonly page: Page;
  private readonly actions: BrowserActions;

  constructor(page: Page) {
    this.page = page;
    this.actions = new BrowserActions(page);
  }

  static using(page: Page): BrowseTheWeb {
    return new BrowseTheWeb(page);
  }

  static as(actor: Actor): Page {
    return actor.usesAbility(BrowseTheWeb).page;
  }

  /**
   * Access to browser interactions and assertions.
   */
  get to(): BrowserActions {
    return this.actions;
  }
}

export class BrowserActions {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }

  async waitForLoadState(state?: 'load' | 'domcontentloaded' | 'networkidle'): Promise<void> {
    await this.page.waitForLoadState(state);
  }

  async waitForResponse(
    urlOrPredicate: string | RegExp | ((response: Response) => boolean | Promise<boolean>),
    options?: { timeout?: number }
  ): Promise<Response> {
    return this.page.waitForResponse(urlOrPredicate, options);
  }

  url(): string {
    return this.page.url();
  }

  async waitForUrl(url: string | RegExp): Promise<void> {
    await this.page.waitForURL(url);
  }

  async waitForState(
    target: Target,
    state: 'visible' | 'hidden' | 'attached' | 'detached',
    options?: { timeout?: number }
  ): Promise<void> {
    await resolveTarget(this.page, target).waitFor({ state, ...options });
  }

  async waitForTimeout(ms: number): Promise<void> {
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(ms);
  }

  async isVisible(target: Target): Promise<boolean> {
    return resolveTarget(this.page, target).isVisible();
  }

  async isVisibleWithin(target: Target, timeout: number): Promise<boolean> {
    return resolveTarget(this.page, target)
      .waitFor({ state: 'visible', timeout })
      .then(() => true)
      .catch(() => false);
  }

  async isDisabled(target: Target): Promise<boolean> {
    return resolveTarget(this.page, target).isDisabled();
  }

  async setChecked(target: Target, checked: boolean): Promise<void> {
    await resolveTarget(this.page, target).setChecked(checked);
  }

  async getAttribute(target: Target, name: string): Promise<string | null> {
    return resolveTarget(this.page, target).getAttribute(name);
  }

  async textContent(target: Target): Promise<string | null> {
    return resolveTarget(this.page, target).textContent();
  }

  async count(target: Target): Promise<number> {
    return resolveTarget(this.page, target).count();
  }

  async checkControl(target: Target): Promise<void> {
    await resolveTarget(this.page, target).check();
  }

  async uncheckControl(target: Target): Promise<void> {
    await resolveTarget(this.page, target).uncheck();
  }

  async waitForDetached(...targets: Target[]): Promise<void> {
    await Promise.all(targets.map(t => resolveTarget(this.page, t).waitFor({ state: 'detached' })));
  }

  async click(target: Target): Promise<void> {
    await resolveTarget(this.page, target).click();
  }

  async hover(target: Target): Promise<void> {
    await resolveTarget(this.page, target).hover();
  }

  async type(target: Target, value: string, options?: { delay?: number; clear?: boolean }): Promise<void> {
    const loc = resolveTarget(this.page, target);
    if (options?.clear !== false) {
      await loc.clear();
    }
    await loc.pressSequentially(value, { delay: options?.delay ?? 100 });
  }

  async fill(target: Target, value: string): Promise<void> {
    await resolveTarget(this.page, target).fill(value);
  }

  async selectByLabel(target: Target, label: string): Promise<void> {
    await resolveTarget(this.page, target).selectOption({ label });
  }

  async canScrollDown(target: Target): Promise<boolean> {
    return resolveTarget(this.page, target).evaluate(
      (el: HTMLElement) => el.scrollHeight - el.clientHeight - el.scrollTop > 1
    );
  }

  async scrollToBottom(target: Target): Promise<void> {
    await resolveTarget(this.page, target).evaluate((el: HTMLElement) => {
      el.scrollTop = el.scrollHeight;
    });
  }

  async scrollIntoView(target: Target): Promise<void> {
    await resolveTarget(this.page, target).scrollIntoViewIfNeeded();
  }

  async dragTo(source: Target, destination: Target): Promise<void> {
    await resolveTarget(this.page, source).dragTo(resolveTarget(this.page, destination));
  }

  async getText(target: Target): Promise<string> {
    const text = await resolveTarget(this.page, target).innerText();
    return text.trim();
  }

  async blur(target: Target): Promise<void> {
    await resolveTarget(this.page, target).blur();
  }

  async getAttributes(target: Target, name: string): Promise<(string | null)[]> {
    return resolveTarget(this.page, target).evaluateAll(
      (elements, attr) => elements.map(el => el.getAttribute(attr)),
      name
    );
  }

  async dragWithMouse(source: Target, destination: Target, dropIndicator?: Target): Promise<void> {
    await resolveTarget(this.page, source).hover();
    await this.page.mouse.down();
    await resolveTarget(this.page, destination).hover();
    if (dropIndicator) {
      await resolveTarget(this.page, dropIndicator).waitFor({ state: 'visible' });
    }
    await this.page.mouse.up();
  }

  async postForm(
    url: string,
    form: Record<string, string | number | boolean>
  ): Promise<{ headers: Record<string, string>; body: Uint8Array }> {
    const response = await this.page.request.post(url, { form });
    const headers = response.headers();
    const body = await response.body();
    return { headers, body };
  }

  async setContent(html: string): Promise<void> {
    await this.page.setContent(html);
  }

  async clickAndWaitForDownload(target: Target): Promise<Download> {
    const downloadPromise = this.page.waitForEvent('download');
    await resolveTarget(this.page, target).click();
    return downloadPromise;
  }

  check(target: Target): TargetAssertions {
    return new TargetAssertions(resolveTarget(this.page, target));
  }

  checkPage(): PageAssertions {
    return new PageAssertions(this.page);
  }
}

export class TargetAssertions {
  constructor(private readonly locator: Locator) {}

  async isVisible(): Promise<void> {
    await expect(this.locator).toBeVisible();
  }

  async isHidden(): Promise<void> {
    await expect(this.locator).toBeHidden();
  }

  async isAttached(): Promise<void> {
    await expect(this.locator).toBeAttached();
  }

  async isNotAttached(): Promise<void> {
    await expect(this.locator).not.toBeAttached();
  }

  async isChecked(): Promise<void> {
    await expect(this.locator).toBeChecked();
  }

  async isNotChecked(): Promise<void> {
    await expect(this.locator).not.toBeChecked();
  }

  async isEnabled(): Promise<void> {
    await expect(this.locator).toBeEnabled();
  }

  async isDisabled(): Promise<void> {
    await expect(this.locator).toBeDisabled();
  }

  async hasValue(expected: string | RegExp): Promise<void> {
    await expect(this.locator).toHaveValue(expected);
  }

  async hasText(expected: string | RegExp): Promise<void> {
    await expect(this.locator).toHaveText(expected);
  }

  async hasAttribute(name: string, value: string | RegExp): Promise<void> {
    await expect(this.locator).toHaveAttribute(name, value);
  }

  async hasCSS(name: string, value: string | RegExp): Promise<void> {
    await expect(this.locator).toHaveCSS(name, value);
  }
}

export class PageAssertions {
  constructor(private readonly page: Page) {}

  async hasUrl(expected: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expected);
  }
}

/**
 * An Actor equipped with the ability to browse the web.
 */
export class WebActor extends Actor {
  private readonly page: Page;
  private readonly browserActions: BrowserActions;

  constructor(name: string, page: Page) {
    super(name);
    this.page = page;
    this.whoCan(BrowseTheWeb.using(page));
    this.browserActions = new BrowserActions(page);
  }

  static using(name: string, page: Page): WebActor {
    return new WebActor(name, page);
  }

  browse(): BrowserActions {
    return this.browserActions;
  }
}

export interface RetryOptions {
  intervals?: number[];
  timeout?: number;
}

/**
 * Task wrapper that retries tasks using Playwright's expect.toPass until they succeed or timeout.
 */
export const Retry = {
  until:
    <TActor extends Actor = WebActor>(tasks: Task<TActor> | Task<TActor>[], options?: RetryOptions): Task<TActor> =>
    async (actor: TActor): Promise<void> => {
      const taskList = Array.isArray(tasks) ? tasks : [tasks];
      await expect(async () => {
        for (const task of taskList) {
          await task(actor);
        }
      }).toPass(options);
    },
};

export { Ability, AbilityType, Actor, Question, Task } from '@stevanfreeborn/screenplay';
