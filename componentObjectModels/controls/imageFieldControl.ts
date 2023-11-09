import { Locator, Page } from '@playwright/test';

export class ImageFieldControl {
  private readonly page: Page;
  private readonly addFileEndpointRegex;
  readonly control: Locator;
  readonly dropzone: Locator;
  readonly browseButton: Locator;

  constructor(imageField: Locator) {
    this.page = imageField.page();
    this.addFileEndpointRegex = /\/Content\/(\d+\/)?\d+\/SaveImages/;
    this.control = imageField;
    this.dropzone = imageField.locator('.image-dropzone');
    this.browseButton = imageField.locator('.k-upload-button');
  }

  async addFile(filePath: string) {
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    const addFileResponse = this.page.waitForResponse(this.addFileEndpointRegex);
    await this.browseButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
    await addFileResponse;
  }
}
