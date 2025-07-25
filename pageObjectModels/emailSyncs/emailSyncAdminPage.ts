import { DeleteEmailSyncDialog } from '../../componentObjectModels/dialogs/deleteEmailSyncDialog';
import { Locator, Page } from '../../fixtures';
import { BaseAdminPage } from '../baseAdminPage';
import { createEmailSyncDialog } from './../../componentObjectModels/dialogs/createEmailSyncDialog';

export class EmailSyncAdminPage extends BaseAdminPage {
  private readonly createEmailSyncButton: Locator;
  private readonly createEmailSyncDialog: createEmailSyncDialog;
  private readonly deleteEmailSyncDialog: DeleteEmailSyncDialog;
  readonly path: string;
  readonly emailSyncGrid: Locator;

  constructor(page: Page) {
    super(page);
    this.createEmailSyncButton = this.page.getByRole('button', { name: 'Create Email Integration (Sync)' });
    this.createEmailSyncDialog = new createEmailSyncDialog(this.page);
    this.deleteEmailSyncDialog = new DeleteEmailSyncDialog(this.page);
    this.path = '/Admin/Integration/EmailSync';
    this.emailSyncGrid = this.page.locator('#grid');
  }

  async goto() {
    await this.page.goto(this.path);
  }

  async createEmailSync(emailSyncName: string) {
    await this.createEmailSyncButton.click();
    await this.createEmailSyncDialog.nameInput.fill(emailSyncName);
    await this.createEmailSyncDialog.saveButton.click();
  }

  async createEmailSyncCopy(emailSyncToCopyName: string, emailSyncCopyName: string) {
    await this.createEmailSyncButton.click();
    await this.createEmailSyncDialog.copyFromRadioButton.waitFor();
    await this.createEmailSyncDialog.copyFromRadioButton.click();
    await this.createEmailSyncDialog.copyFromDropdown.click();
    await this.createEmailSyncDialog.getEmailSyncToCopy(emailSyncToCopyName).click();
    await this.createEmailSyncDialog.nameInput.fill(emailSyncCopyName);
    await this.createEmailSyncDialog.saveButton.click();
  }

  async deleteEmailSync(emailSyncName: string) {
    const connectorRow = this.emailSyncGrid.getByRole('row', { name: emailSyncName }).first();
    const rowElement = await connectorRow.elementHandle();

    if (rowElement === null) {
      return;
    }

    await connectorRow.hover();
    await connectorRow.getByTitle('Delete Email Integration (Sync)').click();
    await this.deleteEmailSyncDialog.deleteButton.click();
    await this.deleteEmailSyncDialog.waitForDialogToBeDismissed();
    await rowElement.waitForElementState('hidden');
  }

  async deleteEmailSyncs(emailSyncNames: string[]) {
    for (const name of emailSyncNames) {
      await this.deleteEmailSync(name);
    }
  }
}
