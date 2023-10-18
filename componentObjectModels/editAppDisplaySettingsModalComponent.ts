import { Locator, Page } from '@playwright/test';

export class EditAppDisplaySettingsModalComponent {
  private readonly page: Page;
  readonly displayLinkSelect: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.displayLinkSelect = page.getByRole('listbox', {
      name: 'Display Link Field',
    });
    this.saveButton = page.getByRole('button', {
      name: 'Save',
    });
  }
}
