import { Page } from '@playwright/test';
import { BaseAdminPage } from '../baseAdminPage';

export class EditSendingNumberPage extends BaseAdminPage {
  readonly pathRegex: RegExp;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Admin\/TextSendingNumber\/\d+\/Edit/;
  }

  async goto(id: number) {
    await this.page.goto(`/Admin/TextSendingNumber/${id}/Edit`);
  }

  getIdFromUrl() {
    if (this.page.url().match(this.pathRegex) === null) {
      throw new Error('The current page is not a sending number edit page.');
    }

    const url = this.page.url();
    const urlParts = url.split('/');
    const id = urlParts[urlParts.length - 2];
    return parseInt(id);
  }
}
