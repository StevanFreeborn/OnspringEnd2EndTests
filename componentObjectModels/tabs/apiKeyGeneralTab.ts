import { Locator, Page } from '@playwright/test';

export class ApiKeyGeneralTab {
  readonly nameInput: Locator;
  readonly descriptionEditor: Locator;
  readonly roleSelect: Locator;
  readonly statusSwitch: Locator;
  readonly statusToggle: Locator;

  constructor(page: Page) {
    this.nameInput = page.getByLabel('Name');
    this.descriptionEditor = page.locator('.content-area.mce-content-body');
    this.roleSelect = page.getByRole('listbox', { name: 'Role' });
    this.statusSwitch = page.getByRole('switch', { name: 'Status' });
    this.statusToggle = this.statusSwitch.locator('span').nth(3);
  }

  async selectRole(role: string) {
    await this.roleSelect.click();
    await this.roleSelect.page().getByRole('option', { name: role }).click();
  }

  async updateStatus(status: boolean) {
    const currentStatus = await this.statusSwitch.getAttribute('aria-checked');

    if ((status === true && currentStatus === 'false') || (status === false && currentStatus === 'true')) {
      await this.statusToggle.click();
    }
  }
}
