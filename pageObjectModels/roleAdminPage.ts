import { Locator, Page } from '@playwright/test';
import { BaseAdminPage } from './baseAdminPage';

export class RoleAdminPage extends BaseAdminPage {
  readonly nameInput: Locator;

  constructor(page: Page) {
    super(page);
  }
}
