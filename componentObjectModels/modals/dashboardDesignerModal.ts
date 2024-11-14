import { FrameLocator, Locator, Page } from '@playwright/test';
import { WaitForOptions } from '../../utils';

export class DashboardDesignerModal {
  private readonly page: Page;
  private readonly designer: FrameLocator;
  private readonly loadingIndicator: Locator;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.designer = this.page.frameLocator('.dialog');
    this.title = this.designer.locator('.ui-dialog-title .bcrumb-end');
    this.loadingIndicator = this.designer.getByText('Loading...');
  }

  async waitFor(options?: WaitForOptions) {
    await this.designer.owner().waitFor(options);
    await this.loadingIndicator.waitFor({ state: 'detached' });
  }
}
