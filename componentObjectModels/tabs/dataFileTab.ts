import { Locator, Page } from '@playwright/test';

export class DataFileTab {
  private readonly page: Page;
  private readonly saveImportFilePath: string;
  readonly nameInput: Locator;
  readonly targetAppSelect: Locator;
  readonly addNewFileLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.saveImportFilePath = '/Admin/Integration/Import/SaveImportFiles';
    this.nameInput = page.getByLabel('Name');
    this.targetAppSelect = page.getByRole('listbox', { name: 'App/Survey' });
    this.addNewFileLink = page.locator('.k-upload-button');
  }

  async selectTargetApp(appName: string) {
    await this.targetAppSelect.click();
    await this.page.getByRole('option', { name: appName }).click();
  }

  async addImportFile(filePath: string) {
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.addNewFileLink.click();

    const fileChooser = await fileChooserPromise;

    const addFileResponse = this.page.waitForResponse(this.saveImportFilePath);
    await fileChooser.setFiles(filePath);
    await addFileResponse;
  }
}
