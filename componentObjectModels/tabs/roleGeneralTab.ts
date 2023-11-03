import { Locator, Page } from '@playwright/test';
import { RoleAdminPage } from '../../pageObjectModels/roles/roleAdminPage';

export class RoleGeneralTab {
  private readonly page: Page;
  readonly nameInput: Locator;
  readonly descriptionEditor: Locator;
  readonly statusSwitch: Locator;
  readonly statusToggle: Locator;

  constructor(roleAdminPage: RoleAdminPage) {
    this.page = roleAdminPage.page;
    this.nameInput = this.page.locator(roleAdminPage.createFormControlSelector('Name'));
    this.descriptionEditor = this.page.locator(
      roleAdminPage.createFormControlSelector('Description', '.content-area.mce-content-body')
    );
    this.statusSwitch = this.page.getByRole('switch');
    this.statusToggle = this.page
      .locator(roleAdminPage.createFormControlSelector('Status', 'div.type-checkbox'))
      .getByRole('switch')
      .locator('span')
      .nth(3);
  }
}
