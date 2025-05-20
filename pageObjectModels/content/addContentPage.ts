import { Page } from '@playwright/test';
import { BASE_URL } from '../../playwright.config';
import { EditableContentPage } from './editableContentPage';

export class AddContentPage extends EditableContentPage {
  readonly pathRegex: RegExp;

  constructor(page: Page) {
    super(page);
    this.pathRegex = new RegExp(`${BASE_URL}/Content/[0-9]+/Add`);
  }

  async goto(appId: number) {
    await this.page.goto(`/Content/${appId}/Add`);
  }

  getAppIdFromUrl() {
    const url = this.page.url();
    const match = url.match(this.pathRegex);

    if (match === null) {
      throw new Error('The current page is not an add content page.');
    }

    const urlParts = url.split('/');
    const appId = urlParts[urlParts.length - 2];
    return parseInt(appId);
  }
}
