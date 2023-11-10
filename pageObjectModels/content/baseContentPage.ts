import { Locator, Page } from '@playwright/test';
import { BaseFormPage } from '../baseFormPage';

export class BaseContentPage extends BaseFormPage {
  protected readonly contentContainer: Locator;

  protected constructor(page: Page) {
    super(page);
    this.contentContainer = this.page.locator('div.contentContainer').first();
  }
}
