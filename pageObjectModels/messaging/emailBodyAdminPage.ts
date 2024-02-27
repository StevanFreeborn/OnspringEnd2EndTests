import { Locator, Page } from '@playwright/test';
import { CreateEmailBodyDialogForApp } from '../../componentObjectModels/dialogs/createEmailBodyDialog';
import { DeleteEmailBodyDialog } from '../../componentObjectModels/dialogs/deleteEmailBodyDialog';
import { BaseAdminPage } from '../baseAdminPage';

export class EmailBodyAdminPage extends BaseAdminPage {
  readonly path: string;
  readonly createEmailBodyButton: Locator;
  readonly createEmailBodyDialog: CreateEmailBodyDialogForApp;
  readonly emailBodyGrid: Locator;
  readonly deleteEmailBodyDialog: DeleteEmailBodyDialog;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Messaging/EmailBody';
    this.createEmailBodyButton = page.getByRole('button', { name: 'Create Email Body' });
    this.createEmailBodyDialog = new CreateEmailBodyDialogForApp(page);
    this.emailBodyGrid = page.locator('#grid');
    this.deleteEmailBodyDialog = new DeleteEmailBodyDialog(page);
  }

  async goto() {
    await this.page.goto(this.path);
  }

  async createEmailBody(appName: string, emailBodyName: string) {
    await this.createEmailBodyButton.click();

    await this.createEmailBodyDialog.nameInput.waitFor();
    await this.createEmailBodyDialog.nameInput.fill(emailBodyName);
    await this.createEmailBodyDialog.selectApp(appName);
    await this.createEmailBodyDialog.saveButton.click();
  }

  async createEmailBodyCopy(appName: string, emailBodyToCopy: string, emailBodyCopyName: string) {
    await this.createEmailBodyButton.click();

    await this.createEmailBodyDialog.copyFromRadioButton.waitFor();
    await this.createEmailBodyDialog.selectApp(appName);
    await this.createEmailBodyDialog.copyFromRadioButton.click();
    await this.createEmailBodyDialog.copyFromDropdown.click();
    await this.createEmailBodyDialog.getEmailBodyToCopy(emailBodyToCopy).click();
    await this.createEmailBodyDialog.nameInput.fill(emailBodyCopyName);
    await this.createEmailBodyDialog.saveButton.click();
  }
}
