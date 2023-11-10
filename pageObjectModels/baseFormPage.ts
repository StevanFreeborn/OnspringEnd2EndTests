import { Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class BaseFormPage extends BasePage {
  readonly saveRecordButton: Locator;

  protected constructor(page: Page) {
    super(page);
    this.saveRecordButton = this.page.getByRole('link', { name: 'Save Record' });
  }
}
