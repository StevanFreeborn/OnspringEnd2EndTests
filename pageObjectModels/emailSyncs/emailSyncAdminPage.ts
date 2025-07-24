import { Locator, Page } from '../../fixtures';
import { BaseAdminPage } from '../baseAdminPage';
import { createEmailSyncDialog } from './../../componentObjectModels/dialogs/createEmailSyncDialog';

export class EmailSyncAdminPage extends BaseAdminPage {
  private readonly createEmailSyncButton: Locator;
  private readonly createEmailSyncDialog: createEmailSyncDialog;
  readonly path: string;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Integration/EmailSync';
    this.createEmailSyncButton = this.page.getByRole('button', { name: 'Create Email Integration (Sync)' });
    this.createEmailSyncDialog = new createEmailSyncDialog(this.page);
  }

  async goto() {
    await this.page.goto(this.path);
  }

  async createEmailSync(emailSyncName: string) {
    await this.createEmailSyncButton.click();
    await this.createEmailSyncDialog.nameInput.fill(emailSyncName);
    await this.createEmailSyncDialog.saveButton.click();
  }
}
