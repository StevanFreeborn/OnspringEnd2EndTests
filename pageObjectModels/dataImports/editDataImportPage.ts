import { Page } from '@playwright/test';
import { BaseDataImportPage } from './baseDataImportPage';

export class EditDataImportPage extends BaseDataImportPage {
  readonly pathRegex: RegExp;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Admin\/Integration\/Import\/\d+\/Edit/;
  }

  async goto(importId: number) {
    await this.page.goto(`/Admin/Integration/Import/${importId}/Edit`);
  }

  async save() {
    const saveResponse = this.page.waitForResponse(
      response => response.url().match(this.pathRegex) !== null && response.request().method() === 'POST'
    );

    await this.saveChangesButton.click();
    await saveResponse;
  }
}
