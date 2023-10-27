import { Locator, Page } from '@playwright/test';

export class EditAppAdminSettingsModalComponent {
  private readonly page: Page;
  readonly adminPermissionsSelect: Locator;
  readonly usersSelect: Locator;
  readonly groupsSelect: Locator;
  readonly rolesSelect: Locator;
  readonly saveButton: Locator;
  readonly selectorCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.adminPermissionsSelect = page.getByRole('listbox', {
      name: 'Administration Permissions',
    });
    this.usersSelect = page.locator('td.label:has-text("Users") + td>div').first();
    this.groupsSelect = page.locator('td.label:has-text("Groups") + td>div').first();
    this.rolesSelect = page.locator('td.label:has-text("Roles") + td>div').first();
    this.saveButton = page.getByRole('button', {
      name: 'Save',
    });
    this.selectorCloseButton = page
      .locator('.selector-control:not(.invisible)')
      .getByTitle('Close')
      .first();
  }

  private getUnselectedSelectorOption(field: string) {
    return this.page.locator(`.selector-control .unselected-pane li:has-text("${field}")`);
  }

  async selectAdminPermissions(permission: string) {
    await this.adminPermissionsSelect.click();
    await this.page.getByRole('option', { name: permission }).click();
  }

  async selectUser(userFullName: string) {
    await this.usersSelect.click();
    await this.getUnselectedSelectorOption(userFullName).click();
    await this.selectorCloseButton.click();
  }

  async selectRole(roleName: string) {
    await this.rolesSelect.click();
    await this.getUnselectedSelectorOption(roleName).click();
    await this.selectorCloseButton.click();
  }

  async selectGroup(groupName: string) {
    await this.groupsSelect.click();
    await this.getUnselectedSelectorOption(groupName).click();
    await this.selectorCloseButton.click();
  }
}
