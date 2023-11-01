import { Locator, Page } from '@playwright/test';
import { BaseAdminFormPage } from '../baseAdminFormPage';

export class GroupAdminPage extends BaseAdminFormPage {
  readonly nameInput: Locator;

  constructor(page: Page) {
    super(page);
    this.nameInput = page.locator(this.createFormControlSelector('Name'));
  }
}
