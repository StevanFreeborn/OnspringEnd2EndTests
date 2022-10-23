import { Page } from '@playwright/test';
import { SharedNavPage } from './sharedNavPage';

export class BasePage {
  readonly page: Page;
  readonly sharedNavPage: SharedNavPage;

  constructor(page: Page) {
    this.page = page;
    this.sharedNavPage = new SharedNavPage(page);
  }
}