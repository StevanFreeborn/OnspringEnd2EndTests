import { Locator, Page } from '@playwright/test';

export class ApiKeyGeneralTab {
  readonly nameInput: Locator;
  readonly descriptionEditor: Locator;
  readonly roleSelect: Locator;

  constructor(page: Page) {
    this.nameInput = page.getByLabel('Name');
    this.descriptionEditor = page.getByLabel('Description');
    this.roleSelect = page.getByLabel('Role');
  }

  async selectRole(role: string) {
    await this.roleSelect.page().getByRole('option', { name: role }).click();
  }
}
