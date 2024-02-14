import { Page } from '@playwright/test';
import { BaseContainerPage } from './baseContainerPage';

export class EditContainerPage extends BaseContainerPage {
  readonly pathRegex: RegExp;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Admin\/Dashboard\/Container\/\d+\/Edit/;
  }

  async goto(containerId: number) {
    await this.page.goto(`/Admin/Dashboard/Container/${containerId}/Edit`);
  }

  async save() {
    const saveResponse = this.page.waitForResponse(
      response => response.url().match(this.pathRegex) !== null && response.request().method() === 'POST'
    );

    await this.saveChangesButton.click();
    await saveResponse;
  }

  getIdFromUrl() {
    if (this.page.url().match(this.pathRegex) === null) {
      throw new Error('The current page is not a container edit page.');
    }

    const url = this.page.url();
    const urlParts = url.split('/');
    const id = urlParts[urlParts.length - 2];
    return parseInt(id);
  }
}
