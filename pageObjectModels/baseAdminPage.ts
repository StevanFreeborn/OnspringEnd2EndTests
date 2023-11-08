import { Page } from '@playwright/test';
import { AdminNav } from '../componentObjectModels/navs/adminNav';
import { BasePage } from './basePage';

export class BaseAdminPage extends BasePage {
  readonly adminNav: AdminNav;

  protected constructor(page: Page) {
    super(page);
    this.adminNav = new AdminNav(page);
  }
}
