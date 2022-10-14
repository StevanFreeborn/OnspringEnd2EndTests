import { Locator, Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly path: string;
  readonly usersFullName: Locator;

  constructor(page: Page) {
    this.page = page;
    this.path = '/Dashboard'
    this.usersFullName = page.locator('#user-name');
  }

  async goto(dashboardId?: number) {
    const path = dashboardId ? `${this.path}/${dashboardId}` : this.path;
    await this.page.goto(path);
  }
}