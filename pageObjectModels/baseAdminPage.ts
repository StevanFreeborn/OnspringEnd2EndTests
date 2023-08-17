import { Page } from '@playwright/test';
import { BasePage } from './basePage';
import { SharedAdminNavPage } from './sharedAdminNavPage';

export class BaseAdminPage extends BasePage {
  readonly page: Page;
  readonly sharedAdminNavPage: SharedAdminNavPage;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.sharedAdminNavPage = new SharedAdminNavPage(page);
  }
}
