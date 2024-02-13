import { Locator, Page } from '@playwright/test';
import { BaseContainerPage } from './baseContainerPage';

export class AddContainerPage extends BaseContainerPage {
  readonly pathRegex: RegExp;
  readonly nameInput: Locator;
  readonly saveChangesButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Admin\/Dashboard\/Container\/Add/;
    this.nameInput = page.getByLabel('Name');
    this.saveChangesButton = page.getByRole('link', { name: 'Save Changes' });
  }
}
