import { Locator, Page } from '@playwright/test';
import { CreateEmailBodyDialog } from '../dialogs/createEmailBodyDialog';
import { DeleteEmailBodyDialog } from '../dialogs/deleteEmailBodyDialog';

export class AppMessagingTab {
  readonly addEmailBodyLink: Locator;
  readonly createEmailBodyDialog: CreateEmailBodyDialog;
  readonly emailBodyGrid: Locator;
  readonly deleteEmailBodyDialog: DeleteEmailBodyDialog;

  constructor(page: Page) {
    this.addEmailBodyLink = page.getByRole('link', { name: 'Add Email Body' });
    this.createEmailBodyDialog = new CreateEmailBodyDialog(page);
    this.emailBodyGrid = page.locator('#grid-emails');
    this.deleteEmailBodyDialog = new DeleteEmailBodyDialog(page);
  }

  async createEmailBody(emailBodyName: string) {
    await this.addEmailBodyLink.click();
    await this.createEmailBodyDialog.nameInput.fill(emailBodyName);
    await this.createEmailBodyDialog.saveButton.click();
  }
}
