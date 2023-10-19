import { Locator, Page } from '@playwright/test';

export class EditAppDisplaySettingsModalComponent {
  private readonly page: Page;
  readonly displayLinkSelect: Locator;
  readonly integrationLinkSelect: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.displayLinkSelect = page.getByRole('listbox', {
      name: 'Display Link Field',
    });
    this.integrationLinkSelect = page.getByRole('listbox', {
      name: 'Integration Link Field',
    });
    this.saveButton = page.getByRole('button', {
      name: 'Save',
    });
  }
}
