import { Locator, Page } from '@playwright/test';
import { DynamicDocument } from '../../models/dynamicDocument';

export class DocumentInformationTab {
  private readonly page: Page;
  private readonly documentNameInput: Locator;
  private readonly statusSwitch: Locator;
  private readonly statusToggle: Locator;
  private readonly addNewFileLink: Locator;
  private readonly saveFilePath: RegExp;

  constructor(page: Page) {
    this.page = page;
    this.documentNameInput = page.getByLabel('Document Name');
    this.statusSwitch = page.getByRole('switch', { name: 'Status' });
    this.statusToggle = this.statusSwitch.locator('span').nth(3);
    this.addNewFileLink = page.locator('.k-upload-button');
    this.saveFilePath = /\/Admin\/Document\/SaveDocumentFiles/;
  }

  private async updateStatus(status: boolean) {
    const checked = await this.statusSwitch.getAttribute('aria-checked');
    const expected = status ? 'true' : 'false';

    if (checked !== expected) {
      await this.statusToggle.click();
    }
  }

  private async addFile(filePath: string) {
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.addNewFileLink.click();

    const fileChooser = await fileChooserPromise;

    const addFileResponse = this.page.waitForResponse(this.saveFilePath);
    await fileChooser.setFiles(filePath);
    await addFileResponse;
  }

  async fillOutTab(document: DynamicDocument) {
    await this.documentNameInput.fill(document.name);
    await this.updateStatus(document.status);
    await this.addFile(document.templatePath);
  }
}
