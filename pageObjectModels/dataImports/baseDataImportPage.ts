import { Locator, Page } from '@playwright/test';
import { BaseAdminPage } from '../baseAdminPage';

export abstract class BaseDataImportPage extends BaseAdminPage {
  readonly nameInput: Locator;

  protected constructor(page: Page) {
    super(page);
    this.nameInput = page.getByLabel('Name');
  }
}
