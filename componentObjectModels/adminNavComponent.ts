import { Locator, Page } from '@playwright/test';

export class AdminNavComponent {
  readonly page: Page;
  readonly adminCreateButton: Locator;
  readonly adminCreateMenu: Locator;
  readonly appCreateMenuOption: Locator;
  readonly userCreateMenuOption: Locator;
  readonly roleCreateMenuOption: Locator;

  constructor(page: Page) {
    this.page = page;
    this.adminCreateButton = page.locator('#admin-create-button');
    this.adminCreateMenu = page.locator('#admin-create-menu');
    this.appCreateMenuOption = this.adminCreateMenu.getByText('App');
    this.userCreateMenuOption = this.adminCreateMenu.getByText('User');
    this.roleCreateMenuOption = this.adminCreateMenu.getByText('Role');
  }
}
