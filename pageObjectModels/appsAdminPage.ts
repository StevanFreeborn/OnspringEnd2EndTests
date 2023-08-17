import { Locator, Page } from '@playwright/test';
import { BaseAdminPage } from './baseAdminPage';

export class AppsAdminPage extends BaseAdminPage {
  readonly page: Page;
  readonly path: string;
  readonly createAppButton: Locator;
  readonly appGrid: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.path = '/Admin/App';
    this.createAppButton = page.locator('.create-button');
    this.appGrid = page.locator('#grid');
  }

  async goto() {
    await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
  }

  async getAppRow(appName: string) {
    return this.appGrid.getByRole('row', { name: appName });
  }
}
