import { Page } from '@playwright/test';
import { BASE_URL } from '../../playwright.config';
import { BaseContentPage } from './baseContentPage';

export class AddContentPage extends BaseContentPage {
  readonly pathRegex: RegExp;

  constructor(page: Page) {
    super(page);
    this.pathRegex = new RegExp(`${BASE_URL}/Content/[0-9]+/Add`);
  }

  async goto(appId: number) {
    await this.page.goto(`/Content/${appId}/Add`);
  }
}
