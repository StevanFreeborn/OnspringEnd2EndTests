import { Locator, Page } from '@playwright/test';
import { CreateEmailBodyDialog } from '../dialogs/createEmailBodyDialog';

export class AppMessagingTab {
  readonly addEmailBodyLink: Locator;
  readonly createEmailBodyDialog: CreateEmailBodyDialog;

  constructor(page: Page) {
    this.addEmailBodyLink = page.getByRole('link', { name: 'Add Email Body' });
    this.createEmailBodyDialog = new CreateEmailBodyDialog(page);
  }

  async createEmailBody(emailBodyName: string) {
    await this.addEmailBodyLink.click();
    await this.createEmailBodyDialog.nameInput.fill(emailBodyName);
    await this.createEmailBodyDialog.saveButton.click();
  }
}
