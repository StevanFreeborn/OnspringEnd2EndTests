import { Locator, Page } from '@playwright/test';
import { CreateEmailTemplateDialog } from '../../componentObjectModels/dialogs/createEmailTemplateDialog';
import { DeleteEmailTemplateDialog } from '../../componentObjectModels/dialogs/deleteEmailTemplateDialog';
import { BaseAdminPage } from '../baseAdminPage';

export class EmailTemplateAdminPage extends BaseAdminPage {
  private readonly getEmailTemplatesPath: string;
  private readonly deleteTemplatePathRegex: RegExp;
  private readonly emailTemplatesGrid: Locator;
  private readonly deleteEmailTemplateDialog: DeleteEmailTemplateDialog;
  private readonly createEmailTemplateButton: Locator;
  private readonly createEmailTemplateDialog: CreateEmailTemplateDialog;
  readonly path: string;

  constructor(page: Page) {
    super(page);
    this.getEmailTemplatesPath = '/Admin/Messaging/Template/GetListPage';
    this.deleteTemplatePathRegex = /\/Admin\/Messaging\/Template\/\d+\/Delete\//;
    this.emailTemplatesGrid = this.page.locator('#grid');
    this.deleteEmailTemplateDialog = new DeleteEmailTemplateDialog(this.page);
    this.createEmailTemplateButton = this.page.getByRole('button', { name: 'Create Email Template' });
    this.createEmailTemplateDialog = new CreateEmailTemplateDialog(this.page);
    this.path = '/Admin/Messaging/Template';
  }

  async goto() {
    const getTemplatesResponse = this.page.waitForResponse(this.getEmailTemplatesPath);
    await this.page.goto(this.path);
    await getTemplatesResponse;
  }

  async deleteEmailTemplates(emailTemplatesToDelete: string[]) {
    await this.goto();

    for (const emailTemplateName of emailTemplatesToDelete) {
      const emailTemplateRow = this.emailTemplatesGrid.getByRole('row', { name: emailTemplateName }).first();
      const rowElement = await emailTemplateRow.elementHandle();

      if (rowElement === null) {
        continue;
      }

      await emailTemplateRow.hover();
      await emailTemplateRow.getByTitle('Delete Email Template').click();
      await this.deleteEmailTemplateDialog.deleteButton.click();
      await this.deleteEmailTemplateDialog.waitForDialogToBeDismissed();
      await rowElement.waitForElementState('hidden');
    }
  }

  async createTemplate(emailTemplateName: string) {
    await this.createEmailTemplateButton.click();
    await this.createEmailTemplateDialog.nameInput.fill(emailTemplateName);
    await this.createEmailTemplateDialog.saveButton.click();
  }

  async createTemplateCopy(emailTemplateName: string, emailTemplateCopyName: string) {
    await this.createEmailTemplateButton.click();
    await this.createEmailTemplateDialog.copyFromRadioButton.waitFor();
    await this.createEmailTemplateDialog.copyFromRadioButton.click();
    await this.createEmailTemplateDialog.copyFromDropdown.click();
    await this.createEmailTemplateDialog.getEmailTemplateToCopy(emailTemplateName).click();
    await this.createEmailTemplateDialog.nameInput.fill(emailTemplateCopyName);
    await this.createEmailTemplateDialog.saveButton.click();
  }
}
