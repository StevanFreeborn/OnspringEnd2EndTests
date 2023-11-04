import { Page } from '@playwright/test';
import { BASE_URL } from '../../playwright.config';
import { BaseContentPage } from './baseContentPage';

export class EditContentPage extends BaseContentPage {
  readonly pathRegex: RegExp;

  constructor(page: Page) {
    super(page);
    this.pathRegex = new RegExp(`${BASE_URL}/Content/[0-9]+/[0-9]+/Edit`);
  }

  async goto(appId: number, recordId: number) {
    await this.page.goto(`/Content/${appId}/${recordId}/Edit`);
  }

  getRecordIdFromUrl() {
    if (this.page.url().match(this.pathRegex) === null) {
      throw new Error('The current page is not a content edit page.');
    }

    const url = this.page.url();
    const urlParts = url.split('/');
    const recordId = urlParts[urlParts.length - 2];
    return parseInt(recordId);
  }
}
