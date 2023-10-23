import { Page } from '@playwright/test';
import { AdminNavComponent } from '../componentObjectModels/adminNavComponent';
import { BasePage } from './basePage';

export class BaseAdminPage extends BasePage {
  readonly page: Page;
  readonly adminNav: AdminNavComponent;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.adminNav = new AdminNavComponent(page);
  }
}
