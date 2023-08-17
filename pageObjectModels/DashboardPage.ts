import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class DashboardPage extends BasePage {
  readonly page: Page;
  readonly path: string;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.path = '/Dashboard';
  }

  async goto(dashboardId?: number) {
    const path = dashboardId ? `${this.path}/${dashboardId}` : this.path;
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }
}
