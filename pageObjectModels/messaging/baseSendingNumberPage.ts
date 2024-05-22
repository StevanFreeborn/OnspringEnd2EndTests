import { Locator, Page } from '@playwright/test';
import { BaseAdminPage } from '../baseAdminPage';

export abstract class BaseSendingNumberPage extends BaseAdminPage {
  readonly saveButton: Locator;
  readonly nameInput: Locator;
  readonly descriptionEditor: Locator;
  readonly defaultCheckbox: Locator;
  readonly smsSendingNumber: Locator;

  constructor(page: Page) {
    super(page);
    this.saveButton = page.getByRole('link', { name: 'Save Changes' });
    this.nameInput = page.getByLabel('Name');
    this.descriptionEditor = page.locator('.content-area.mce-content-body');
    this.defaultCheckbox = page.getByRole('checkbox');
    this.smsSendingNumber = page.locator('#form-selected-number');
  }
}
