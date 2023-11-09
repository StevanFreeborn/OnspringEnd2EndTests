import { Locator, Page } from '@playwright/test';

export class AttachmentFieldControl {
  private readonly page: Page;
  private readonly saveAttachmentEndpointRegex;
  readonly control: Locator;
  readonly attachmentDropzone: Locator;
  readonly uploadButton: Locator;
  readonly downloadAllButton: Locator;
  readonly attachmentGridHeader: Locator;
  readonly attachmentGridBody: Locator;

  constructor(attachmentField: Locator) {
    this.page = attachmentField.page();
    this.saveAttachmentEndpointRegex = /\/Content\/(\d+\/)?\d+\/SaveAttachments/;
    this.control = attachmentField;
    this.attachmentDropzone = attachmentField.locator('.attachment-dropzone');
    this.uploadButton = attachmentField.locator('.k-upload-button');
    this.downloadAllButton = attachmentField.getByRole('button', { name: 'Download All' });
    this.attachmentGridHeader = attachmentField.locator('.k-grid-header');
    this.attachmentGridBody = attachmentField.locator('.k-grid-content');
  }

  async addFile(filePath: string) {
    let fileId = 0;

    const fileChooserPromise = this.page.waitForEvent('filechooser');
    const addFileResponse = this.page.waitForResponse(async res => {
      const isAddFileResponse = res.url().match(this.saveAttachmentEndpointRegex);

      if (isAddFileResponse === null) {
        return false;
      }

      const body = await res.json();
      fileId = body.data[0].fileId;
      return isAddFileResponse !== null;
    });

    await this.uploadButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
    await addFileResponse;

    return fileId;
  }
}
