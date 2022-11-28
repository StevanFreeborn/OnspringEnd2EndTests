import { Locator, Page } from '@playwright/test';
import { BaseAdminPage } from './baseAdminPage';

export class AppsAdminPage extends BaseAdminPage {
  readonly page: Page;
  readonly path: string;
  readonly createAppButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.path = '/Admin/App';
    this.createAppButton = page.locator('.create-button');
  }

  async goto(appId: number) {
    const path = `${this.path}/${appId}`;
    await this.page.goto(path);
  }
}