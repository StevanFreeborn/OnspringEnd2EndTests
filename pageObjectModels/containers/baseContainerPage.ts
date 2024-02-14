import { Locator, Page } from '@playwright/test';
import { BaseAdminPage } from '../baseAdminPage';

export abstract class BaseContainerPage extends BaseAdminPage {
  readonly nameInput: Locator;
  readonly saveChangesButton: Locator;

  protected constructor(page: Page) {
    super(page);
    this.nameInput = page.getByLabel('Name');
    this.saveChangesButton = page.getByRole('link', { name: 'Save Changes' });
  }
}
