import { Locator, Page } from '@playwright/test';

export class SidebarNav {
  readonly page: Page;
  readonly usersFullName: Locator;
  readonly adminGearIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usersFullName = page.locator('#user-name');
    this.adminGearIcon = page.locator('#admin-tab');
  }
}
