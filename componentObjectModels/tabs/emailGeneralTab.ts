import { Locator, Page } from '@playwright/test';

export class EmailGeneralTab {
  readonly nameInput: Locator;
  readonly descriptionEditor: Locator;
  private readonly templateSelect: Locator;
  private readonly statusSwitch: Locator;
  private readonly statusToggle: Locator;

  constructor(page: Page) {
    this.nameInput = page.getByLabel('Name', { exact: true });
    this.descriptionEditor = page.locator('.content-area.mce-content-body');
    this.templateSelect = page.getByRole('listbox', { name: 'Template' });
    this.statusSwitch = page.getByRole('switch', { name: 'Status' });
    this.statusToggle = this.statusSwitch.locator('span').nth(3);
  }

  async selectTemplate(template: string) {
    await this.templateSelect.click();
    await this.templateSelect.page().getByRole('option', { name: template }).click();
  }

  async enableStatus() {
    const checked = await this.statusSwitch.getAttribute('aria-checked');

    if (checked === 'false') {
      await this.statusToggle.click();
    }
  }

  async disableStatus() {
    const checked = await this.statusSwitch.getAttribute('aria-checked');

    if (checked === 'true') {
      await this.statusToggle.click();
    }
  }
}
