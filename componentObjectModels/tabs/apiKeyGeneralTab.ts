import { Locator, Page } from '@playwright/test';

export class ApiKeyGeneralTab {
  readonly nameInput: Locator;
  readonly descriptionEditor: Locator;
  readonly roleSelect: Locator;

  constructor(page: Page) {
    this.nameInput = page.getByLabel('Name');
    this.descriptionEditor = page.locator('.content-area.mce-content-body');
    this.roleSelect = page.getByRole('listbox', { name: 'Role' });
  }

  async selectRole(role: string) {
    await this.roleSelect.click();
    await this.roleSelect.page().getByRole('option', { name: role }).click();
  }
}
