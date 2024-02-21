import { Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class BaseFormPage extends BasePage {
  readonly saveRecordButton: Locator;
  readonly saveAndCloseButton: Locator;
  readonly cancelButton: Locator;

  protected constructor(page: Page) {
    super(page);
    this.saveRecordButton = this.page.getByRole('link', { name: 'Save Record' });
    this.saveAndCloseButton = this.page.getByRole('link', { name: 'Save & Close' });
    this.cancelButton = this.page.getByRole('link', { name: 'Cancel' });
  }
}
