import { Locator, Page } from '@playwright/test';
import { CreateEmailTemplateDialog } from '../../componentObjectModels/dialogs/createEmailTemplateDialog';
import { DeleteEmailTemplateDialog } from '../../componentObjectModels/dialogs/deleteEmailTemplateDialog';
import { TEST_EMAIL_TEMPLATE_NAME } from '../../factories/fakeDataFactory';
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
    this.deleteTemplatePathRegex = /\/Admin\/Messaging\/Template\/\d+\/Delete/;
    this.emailTemplatesGrid = this.page.locator('#grid');
    this.deleteEmailTemplateDialog = new DeleteEmailTemplateDialog(this.page);
    this.createEmailTemplateButton = this.page.getByRole('button', { name: 'Create Email Template' });
    this.createEmailTemplateDialog = new CreateEmailTemplateDialog(this.page);
    this.path = '/Admin/Messaging/Template';
  }

  private async scrollAllTemplatesIntoView() {
    const scrollableElement = this.emailTemplatesGrid.locator('.k-grid-content.k-auto-scrollable').first();

    const pager = this.emailTemplatesGrid.locator('.k-pager-info').first();
    const pagerText = await pager.innerText();
    const totalNumOfEmailTemplates = parseInt(pagerText.trim().split(' ')[0]);

    if (Number.isNaN(totalNumOfEmailTemplates) === false) {
      const emailTemplateRows = this.emailTemplatesGrid.getByRole('row');
      let emailTemplateRowsCount = await emailTemplateRows.count();

      while (emailTemplateRowsCount < totalNumOfEmailTemplates) {
        const scrollResponse = this.page.waitForResponse(this.getEmailTemplatesPath);
        await scrollableElement.evaluate(el => (el.scrollTop = el.scrollHeight));
        await scrollResponse;
        emailTemplateRowsCount = await emailTemplateRows.count();
      }
    }
  }

  async goto() {
    const getTemplatesResponse = this.page.waitForResponse(this.getEmailTemplatesPath);
    await this.page.goto(this.path);
    await getTemplatesResponse;
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

  getRowByName(emailTemplateName: string) {
    return this.emailTemplatesGrid.getByRole('row', { name: emailTemplateName });
  }

  async deleteTemplate(emailTemplateName: string) {
    await this.scrollAllTemplatesIntoView();

    const emailTemplateRow = this.getRowByName(emailTemplateName);
    const rowElement = await emailTemplateRow.elementHandle();

    if (rowElement === null) {
      return;
    }

    await emailTemplateRow.hover();
    await emailTemplateRow.getByTitle('Delete Email Template').click();
    await this.deleteEmailTemplateDialog.deleteButton.click();
    await this.deleteEmailTemplateDialog.waitForDialogToBeDismissed();
    await rowElement.waitForElementState('hidden');
  }

  async deleteTemplates(emailTemplatesToDelete: string[]) {
    await this.goto();

    for (const emailTemplateName of emailTemplatesToDelete) {
      await this.deleteTemplate(emailTemplateName);
    }
  }

  async deleteAllTestTemplates() {
    await this.goto();

    await this.scrollAllTemplatesIntoView();

    const emailTemplateRow = this.emailTemplatesGrid
      .getByRole('row', { name: new RegExp(TEST_EMAIL_TEMPLATE_NAME, 'i') })
      .last();

    let isVisible = await emailTemplateRow.isVisible();

    while (isVisible) {
      const rowElement = await emailTemplateRow.elementHandle();

      if (rowElement === null) {
        return;
      }

      await emailTemplateRow.hover();
      await emailTemplateRow.getByTitle('Delete Email Template').click();
      await this.deleteEmailTemplateDialog.deleteButton.click();
      await this.deleteEmailTemplateDialog.waitForDialogToBeDismissed();
      await rowElement.waitForElementState('hidden');

      isVisible = await emailTemplateRow.isVisible();
    }
  }
}
