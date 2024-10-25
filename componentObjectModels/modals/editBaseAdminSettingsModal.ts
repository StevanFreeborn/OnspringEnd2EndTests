import { Locator, Page } from '@playwright/test';
import { DualPaneSelector } from '../controls/dualPaneSelector';

export abstract class EditBaseAdminSettingsModal {
  private readonly page: Page;
  private readonly modal: Locator;
  private readonly saveButton: Locator;

  readonly adminPermissionsSelect: Locator;
  readonly usersDualPaneSelector: DualPaneSelector;
  readonly groupsDualPaneSelector: DualPaneSelector;
  readonly rolesDualPaneSelector: DualPaneSelector;

  protected constructor(page: Page) {
    this.page = page;
    this.modal = page.getByRole('dialog', { name: /administration settings/i });
    this.adminPermissionsSelect = this.modal.getByRole('listbox', {
      name: 'Administration Permissions',
    });
    this.usersDualPaneSelector = new DualPaneSelector(this.modal.locator('.label:has-text("Users") + .data'));
    this.groupsDualPaneSelector = new DualPaneSelector(this.modal.locator('.label:has-text("Groups") + .data'));
    this.rolesDualPaneSelector = new DualPaneSelector(this.modal.locator('.label:has-text("Roles") + .data'));
    this.saveButton = this.modal.getByRole('button', {
      name: 'Save',
    });
  }

  async selectAdminPermissions(permission: string) {
    await this.adminPermissionsSelect.click();
    await this.page.getByRole('option', { name: permission }).click();
  }

  async selectUser(userFullName: string) {
    await this.usersDualPaneSelector.selectOption(userFullName);
  }

  async selectRole(roleName: string) {
    await this.rolesDualPaneSelector.selectOption(roleName);
  }

  async selectGroup(groupName: string) {
    await this.groupsDualPaneSelector.selectOption(groupName);
  }

  async save() {
    await this.saveButton.click();
    await this.modal.waitFor({ state: 'hidden' });
  }
}
