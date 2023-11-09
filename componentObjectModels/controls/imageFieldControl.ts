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
    let fileId = 0;

    const fileChooserPromise = this.page.waitForEvent('filechooser');
    const addFileResponse = this.page.waitForResponse(async res => {
      const isAddFileResponse = res.url().match(this.addFileEndpointRegex);

      if (isAddFileResponse === null) {
        return false;
      }

      const body = await res.json();
      fileId = body.data[0].fileId;
      return isAddFileResponse !== null;
    });

    await this.browseButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
    await addFileResponse;

    return fileId;
  }
}
