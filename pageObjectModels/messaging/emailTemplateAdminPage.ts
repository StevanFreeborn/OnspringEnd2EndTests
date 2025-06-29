import { Locator, Page } from '@playwright/test';
import { DeleteEmailTemplateDialog } from '../../componentObjectModels/dialogs/deleteEmailTemplateDialog';
import { BaseAdminPage } from '../baseAdminPage';

export class EmailTemplateAdminPage extends BaseAdminPage {
  private readonly getEmailTemplatesPath: string;
  private readonly deleteTemplatePathRegex: RegExp;
  private readonly emailTemplatesGrid: Locator;
  private readonly deleteEmailTemplateDialog: DeleteEmailTemplateDialog;
  readonly path: string;

  constructor(page: Page) {
    super(page);
    this.getEmailTemplatesPath = '/Admin/Messaging/Template/GetListPage';
    this.deleteTemplatePathRegex = /\/Admin\/Messaging\/Template\/\d+\/Delete\//;
    this.emailTemplatesGrid = this.page.locator('#grid');
    this.deleteEmailTemplateDialog = new DeleteEmailTemplateDialog(this.page);
    this.path = '/Admin/Messaging/Template';
  }

  async goto() {
    await this.page.goto(this.path);
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
}
