import { Locator, Page } from '@playwright/test';

export class BaseCreateOrAddDialog {
  protected readonly page: Page;
  readonly continueButton: Locator;
  readonly copyFromRadioButton: Locator;
  readonly selectDropdown: Locator;

  protected constructor(page: Page) {
    this.page = page;
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.copyFromRadioButton = page.getByText('Copy from');
    this.selectDropdown = page.getByRole('listbox').first();
  }

  protected getItemToCopy(itemName: string) {
    return this.page.getByRole('option', { name: itemName });
  }
}
