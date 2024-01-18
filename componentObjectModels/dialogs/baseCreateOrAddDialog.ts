import { Locator, Page } from '@playwright/test';

abstract class BaseCreateOrAddDialog {
  protected readonly page: Page;
  readonly copyFromRadioButton: Locator;
  readonly selectDropdown: Locator;

  protected constructor(page: Page) {
    this.page = page;
    this.copyFromRadioButton = page.getByText('Copy from');
    this.selectDropdown = page.getByRole('listbox').first();
  }

  protected getItemToCopy(itemName: string) {
    return this.page.getByRole('option', { name: itemName });
  }
}

export abstract class BaseCreateOrAddDialogWithContinueButton extends BaseCreateOrAddDialog {
  readonly continueButton: Locator;

  protected constructor(page: Page) {
    super(page);
    this.continueButton = page.getByRole('button', { name: 'Continue' });
  }
}

export abstract class BaseCreateOrAddDialogWithSaveButton extends BaseCreateOrAddDialog {
  readonly nameInput: Locator;
  readonly saveButton: Locator;

  protected constructor(page: Page) {
    super(page);
    this.nameInput = page.locator('input#Name');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }
}
