import { Locator, Page } from '@playwright/test';
import { CreateEmailBodyDialog } from '../dialogs/createEmailBodyDialog';
import { DeleteEmailBodyDialog } from '../dialogs/deleteEmailBodyDialog';
import { CreateTextMessageDialog } from './createTextMessageDialog';

export class AppMessagingTab {
  readonly addEmailBodyLink: Locator;
  readonly createEmailBodyDialog: CreateEmailBodyDialog;
  readonly emailBodyGrid: Locator;
  readonly deleteEmailBodyDialog: DeleteEmailBodyDialog;

  readonly addTextMessageLink: Locator;
  readonly createTextMessageDialog: CreateTextMessageDialog;
  readonly textMessageGrid: Locator;

  constructor(page: Page) {
    this.addEmailBodyLink = page.getByRole('link', { name: 'Add Email Body' });
    this.createEmailBodyDialog = new CreateEmailBodyDialog(page);
    this.emailBodyGrid = page.locator('#grid-emails');
    this.deleteEmailBodyDialog = new DeleteEmailBodyDialog(page);

    this.addTextMessageLink = page.getByRole('link', { name: 'Add Text Message' });
    this.createTextMessageDialog = new CreateTextMessageDialog(page);
    this.textMessageGrid = page.locator('#grid-text-messages');
  }

  async createEmailBody(emailBodyName: string) {
    await this.addEmailBodyLink.click();
    await this.createEmailBodyDialog.nameInput.fill(emailBodyName);
    await this.createEmailBodyDialog.saveButton.click();
  }

  async createEmailBodyCopy(emailToCopy: string, emailBodyName: string) {
    await this.addEmailBodyLink.click();
    await this.createEmailBodyDialog.copyFromRadioButton.click();
    await this.createEmailBodyDialog.copyFromDropdown.click();
    await this.createEmailBodyDialog.getEmailBodyToCopy(emailToCopy).click();
    await this.createEmailBodyDialog.nameInput.fill(emailBodyName);
    await this.createEmailBodyDialog.saveButton.click();
  }

  async createTextMessage(textMessageName: string) {
    await this.addTextMessageLink.click();
    await this.createTextMessageDialog.nameInput.fill(textMessageName);
    await this.createTextMessageDialog.saveButton.click();
  }
}
