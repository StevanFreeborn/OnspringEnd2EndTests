import { Locator, Page } from '@playwright/test';
import { BaseAdminPage } from './baseAdminPage';

export class AppAdminPage extends BaseAdminPage {
  readonly page: Page;
  readonly path: string;
  readonly pathRegex: RegExp;
  readonly appName: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.path = '/Admin/App/';
    this.pathRegex = new RegExp(`${process.env.INSTANCE_URL}${this.path}[0-9]+`);
    this.appName = page.locator('td:nth-match(td:right-of(label:has-text("Name")), 1)');
  }

  async goto(appId: number) {
    const path = `${this.path}/${appId}`;
    await this.page.goto(path);
  }
}