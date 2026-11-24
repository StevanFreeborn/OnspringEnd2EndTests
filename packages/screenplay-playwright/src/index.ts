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

  async isEnabled(target: Target): Promise<boolean> {
    return resolveTarget(this.page, target).isEnabled();
  }

  async isEditable(target: Target): Promise<boolean> {
    return resolveTarget(this.page, target).isEditable();
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

  async focus(target: Target): Promise<void> {
    await resolveTarget(this.page, target).focus();
  }

  async clear(target: Target): Promise<void> {
    await resolveTarget(this.page, target).clear();
  }

  async moveMouse(x: number, y: number): Promise<void> {
    await this.page.mouse.move(x, y);
  }

  async setTextContent(target: Target, text: string): Promise<void> {
    await resolveTarget(this.page, target).evaluate((el, value) => {
      el.textContent = value;
    }, text);
  }

  async setCodeMirrorValue(target: Target, value: string): Promise<void> {
    await resolveTarget(this.page, target).evaluate((el, val) => {
      const cm = (el as HTMLElement & { CodeMirror?: { setValue: (v: string) => void } }).CodeMirror;
      if (!cm) {
        throw new Error('Target element does not expose a CodeMirror instance.');
      }
      cm.setValue(val);
    }, value);
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(500);
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

  async getAllTexts(target: Target): Promise<string[]> {
    return resolveTarget(this.page, target).allTextContents();
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

  async interceptJsonResponseOnce<T = unknown>(
    urlPattern: string | RegExp,
    transform: (body: T) => T | void
  ): Promise<void> {
    await this.page.route(
      urlPattern,
      async route => {
        const response = await route.fetch();
        const body = (await response.json()) as T;
        const transformed = transform(body);
        await route.fulfill({ response, json: transformed === undefined ? body : transformed });
      },
      { times: 1 }
    );
  }

  async postForm(
    url: string,
    form?: Record<string, string | number | boolean>
  ): Promise<{ headers: Record<string, string>; body: Uint8Array }> {
    const response = await this.page.request.post(url, form ? { form } : undefined);
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

  async uploadViaFileChooser(
    triggerTarget: Target,
    files: string | string[],
    options?: { waitForResponseUrl?: string | RegExp | ((response: Response) => boolean | Promise<boolean>) }
  ): Promise<Response | undefined> {
    const [fileChooser] = await Promise.all([
      this.page.waitForEvent('filechooser'),
      resolveTarget(this.page, triggerTarget).click(),
    ]);

    if (options?.waitForResponseUrl) {
      const [response] = await Promise.all([
        this.page.waitForResponse(options.waitForResponseUrl),
        fileChooser.setFiles(files),
      ]);
      return response;
    }

    await fileChooser.setFiles(files);
    return undefined;
  }

  async clickAndOpenNewTab(target: Target, actorName: string = 'NewTab'): Promise<WebActor> {
    const pagePromise = this.page.context().waitForEvent('page');
    await resolveTarget(this.page, target).click();
    const newPage = await pagePromise;
    await newPage.waitForLoadState();
    return WebActor.using(actorName, newPage);
  }

  async close(): Promise<void> {
    await this.page.close();
  }

  check(target: Target): TargetAssertions {
    return new TargetAssertions(this.page, resolveTarget(this.page, target));
  }

  checkPage(): PageAssertions {
    return new PageAssertions(this.page);
  }
}

type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export class TargetAssertions {
  constructor(
    private readonly page: Page,
    private readonly locator: Locator
  ) {}

  async isVisible(options?: { timeout?: number }): Promise<void> {
    await expect(this.locator).toBeVisible(options);
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

  async doesNotHaveValue(expected: string | RegExp): Promise<void> {
    await expect(this.locator).not.toHaveValue(expected);
  }

  async hasText(expected: string | RegExp, options?: { timeout?: number }): Promise<void> {
    await expect(this.locator).toHaveText(expected, options);
  }

  async doesNotHaveText(expected: string | RegExp, options?: { timeout?: number }): Promise<void> {
    await expect(this.locator).not.toHaveText(expected, options);
  }

  async hasClass(expected: string | RegExp): Promise<void> {
    await expect(this.locator).toHaveClass(expected);
  }

  async doesNotHaveClass(expected: string | RegExp): Promise<void> {
    await expect(this.locator).not.toHaveClass(expected);
  }

  async hasCount(count: number, options?: { timeout?: number }): Promise<void> {
    await expect(this.locator).toHaveCount(count, options);
  }

  async hasAttribute(name: string, value: string | RegExp): Promise<void> {
    await expect(this.locator).toHaveAttribute(name, value);
  }

  async hasCSS(name: string, value: string | RegExp): Promise<void> {
    await expect(this.locator).toHaveCSS(name, value);
  }

  async hasScreenshot(options?: {
    maxDiffPixels?: number;
    maxDiffPixelRatio?: number;
    threshold?: number;
    timeout?: number;
  }): Promise<void> {
    await expect(this.locator).toHaveScreenshot(options);
  }

  private async assertRelativePosition(
    other: Target,
    relation: string,
    predicate: (main: BoundingBox, relative: BoundingBox) => boolean,
    options?: { timeout?: number }
  ): Promise<void> {
    const otherLocator = resolveTarget(this.page, other);
    await expect
      .poll(
        async () => {
          const mainBox = await this.locator.boundingBox();
          const relativeBox = await otherLocator.boundingBox();
          return mainBox !== null && relativeBox !== null && predicate(mainBox, relativeBox);
        },
        {
          message: `${this.locator.toString()} to be ${relation} ${otherLocator.toString()}`,
          timeout: options?.timeout,
        }
      )
      .toBeTruthy();
  }

  async isLeftOf(other: Target, options?: { timeout?: number }): Promise<void> {
    await this.assertRelativePosition(other, 'left of', (a, b) => a.x + a.width <= b.x, options);
  }

  async isRightOf(other: Target, options?: { timeout?: number }): Promise<void> {
    await this.assertRelativePosition(other, 'right of', (a, b) => a.x >= b.x + b.width, options);
  }

  async isAbove(other: Target, options?: { timeout?: number }): Promise<void> {
    await this.assertRelativePosition(other, 'above', (a, b) => a.y + a.height <= b.y, options);
  }

  async isBelow(other: Target, options?: { timeout?: number }): Promise<void> {
    await this.assertRelativePosition(other, 'below', (a, b) => a.y >= b.y + b.height, options);
  }

  async opensNewTabWithUrl(expected: string | RegExp): Promise<void> {
    const pagePromise = this.page.context().waitForEvent('page');
    await this.locator.click();
    const newPage = await pagePromise;
    try {
      await newPage.waitForLoadState();
      await expect(newPage).toHaveURL(expected);
    } finally {
      await newPage.close();
    }
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

export type RetryOptions = {
  intervals?: number[];
  timeout?: number;
};

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
