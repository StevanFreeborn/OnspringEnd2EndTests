import { Locator, Page } from '@playwright/test';
import { BaseAdminFormPage } from '../baseAdminFormPage';

export class GroupAdminPage extends BaseAdminFormPage {
  readonly nameInput: Locator;
  readonly descriptionEditor: Locator;

  constructor(page: Page) {
    super(page);
    this.nameInput = page.locator(this.createFormControlSelector('Name'));
    this.descriptionEditor = page.locator(
      this.createFormControlSelector('Description', '.content-area.mce-content-body')
    );
  }
}
