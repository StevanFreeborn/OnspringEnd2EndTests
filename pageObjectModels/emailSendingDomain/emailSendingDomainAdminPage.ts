import { CreateEmailSendingDomainDialog } from '../../componentObjectModels/dialogs/createEmailSendingDomainDialog';
import { Locator, Page } from '../../fixtures';
import { BaseAdminPage } from '../baseAdminPage';

export class EmailSendingDomainAdminPage extends BaseAdminPage {
  private readonly getListPath: string;
  private readonly createEmailSendingDomainButton: Locator;
  private readonly createEmailSendingDomainDialog: CreateEmailSendingDomainDialog;
  readonly path: string;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/EmailSendingDomain';
    this.getListPath = '/Admin/EmailSendingDomain/GetListPage';
    this.createEmailSendingDomainButton = this.page.getByRole('button', { name: 'Create Email Sending Domain' });
    this.createEmailSendingDomainDialog = new CreateEmailSendingDomainDialog(this.page);
  }

  async goto() {
    const response = this.page.waitForResponse(this.getListPath);
    await this.page.goto(this.path);
    await response;
  }

  async createEmailSendingDomain(emailSendingDomain: string) {
    await this.createEmailSendingDomainButton.click();
    await this.createEmailSendingDomainDialog.nameInput.fill(emailSendingDomain);
    await this.createEmailSendingDomainDialog.saveButton.click();
  }
}
