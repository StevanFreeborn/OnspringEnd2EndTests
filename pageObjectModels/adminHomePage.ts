import { Page } from '@playwright/test';
import { BaseAdminPage } from './baseAdminPage';

export class AdminHomePage extends BaseAdminPage {
  readonly page: Page;
  readonly path: string;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.path = '/Admin/Home';
  }

  async goto() {
    await this.page.goto(this.path);
  }
}