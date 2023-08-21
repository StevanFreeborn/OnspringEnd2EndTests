import { Locator, Page } from '@playwright/test';

export class EditAppGeneralSettingsModalComponent {
  private readonly page: Page;
  readonly nameInput: Locator;
  readonly descriptionEditor: Locator;
  readonly statusToggle: Locator;
  readonly statusSwitch: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel('Name');
    this.descriptionEditor = page.locator('.content-area.mce-content-body');
    this.statusSwitch = page.getByRole('switch', { name: 'Status' });
    this.statusToggle = page
      .getByRole('switch', { name: 'Status' })
      .locator('span')
      .nth(3);
    this.saveButton = page.getByRole('button', {
      name: 'Save',
    });
  }
}
