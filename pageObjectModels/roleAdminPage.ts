import { Locator, Page } from '@playwright/test';
import { BaseAdminFormPage } from './baseAdminFormPage';

export class RoleAdminPage extends BaseAdminFormPage {
  readonly nameInput: Locator;
  readonly statusSwitch: Locator;
  readonly statusToggle: Locator;

  constructor(page: Page) {
    super(page);
    this.nameInput = page.locator(this.createFormControlSelector('Name'));
    this.statusSwitch = page.getByRole('switch');
    this.statusToggle = page
      .locator(this.createFormControlSelector('Status', 'div.type-checkbox'))
      .getByRole('switch')
      .locator('span')
      .nth(3);
  }
}
