import { FrameLocator, Locator, Page } from '@playwright/test';

type WaitForOptions = Parameters<Locator['waitFor']>[0];

export class DashboardDesignerModal {
  private readonly page: Page;
  private readonly designer: FrameLocator;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.designer = this.page.frameLocator('.dialog');
    this.title = this.designer.locator('.ui-dialog-title .bcrumb-end');
  }

  async waitFor(options?: WaitForOptions) {
    await this.designer.owner().waitFor(options);
  }
}
