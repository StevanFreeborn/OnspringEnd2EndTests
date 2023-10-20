import { Locator, Page } from '@playwright/test';

export class EditAppAdminSettingsModalComponent {
  private readonly page: Page;
  readonly adminPermissionsSelect: Locator;
  readonly usersSelect: Locator;
  readonly groupsSelect: Locator;
  readonly rolesSelect: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.adminPermissionsSelect = page.getByRole('listbox', {
      name: 'Administration Permissions',
    });
    this.usersSelect = page
      .locator('td.label:has-text("Users") + td>div')
      .first();
    this.groupsSelect = page
      .locator('td.label:has-text("Groups") + td>div')
      .first();
    this.rolesSelect = page
      .locator('td.label:has-text("Roles") + td>div')
      .first();
    this.saveButton = page.getByRole('button', {
      name: 'Save',
    });
  }
}
