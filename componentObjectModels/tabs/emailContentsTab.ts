import { Locator, Page } from '@playwright/test';
import { DownloadsWarningDialog } from '../dialogs/downloadsWarningDialog';

export class EmailContentsTab {
  readonly fieldsBank: Locator;
  readonly subjectInput: Locator;
  readonly bodyEditor: Locator;
  readonly allowDownloadsCheckbox: Locator;
  readonly downloadsWarningDialog: DownloadsWarningDialog;
  readonly recordLinkTextInput: Locator;

  constructor(page: Page) {
    this.fieldsBank = page.locator('.fields-list');
    this.subjectInput = page.getByLabel('Subject');
    this.bodyEditor = page.locator('.content-area.mce-content-body');
    this.allowDownloadsCheckbox = page.getByLabel('Allow downloadable attachments from attachment fields');
    this.downloadsWarningDialog = new DownloadsWarningDialog(page);
    this.recordLinkTextInput = page.getByLabel('Record Link Text');
  }

  async enableDownloads() {
    const checked = await this.allowDownloadsCheckbox.isChecked();

    if (checked === false) {
      await this.allowDownloadsCheckbox.click();
      await this.downloadsWarningDialog.okButton.waitFor();
      await this.downloadsWarningDialog.okButton.click();
    }
  }

  async disableDownloads() {
    const checked = await this.allowDownloadsCheckbox.isChecked();

    if (checked) {
      await this.allowDownloadsCheckbox.click();
    }
  }
}
