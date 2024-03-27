import { Locator, Page } from '@playwright/test';

export class RoleAdminPermTab {
  readonly adminReportsGrid: Locator;

  constructor(page: Page) {
    this.adminReportsGrid = page
      .locator('section')
      .filter({
        has: page.getByRole('heading', { name: 'Administration Reports' }),
      })
      .getByRole('table');
  }
}
