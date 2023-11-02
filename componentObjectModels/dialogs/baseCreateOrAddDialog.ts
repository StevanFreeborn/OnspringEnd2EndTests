import { Locator, Page } from '@playwright/test';

export class BaseCreateOrAddDialog {
  protected readonly page: Page;
  readonly continueButton: Locator;
  readonly copyFromRadioButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.copyFromRadioButton = page.getByText('Copy from');
  }

  getSelectDropdown(dialogName: string, placeholderText: string) {
    return this.page.getByRole('dialog', { name: dialogName }).getByText(placeholderText);
  }

  getItemToCopy(itemName: string) {
    return this.page.getByRole('option', { name: itemName });
  }
}
