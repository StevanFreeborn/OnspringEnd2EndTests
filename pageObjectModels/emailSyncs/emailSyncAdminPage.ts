import { DeleteEmailSyncDialog } from '../../componentObjectModels/dialogs/deleteEmailSyncDialog';
import { TEST_EMAIL_SYNC_NAME } from '../../factories/fakeDataFactory';
import { Locator, Page } from '../../fixtures';
import { BaseAdminPage } from '../baseAdminPage';
import { createEmailSyncDialog } from './../../componentObjectModels/dialogs/createEmailSyncDialog';

export class EmailSyncAdminPage extends BaseAdminPage {
  private readonly getEmailSyncsPath: string;
  private readonly createEmailSyncButton: Locator;
  private readonly createEmailSyncDialog: createEmailSyncDialog;
  private readonly deleteEmailSyncDialog: DeleteEmailSyncDialog;
  private readonly deleteEmailSyncPathRegex: RegExp;
  readonly path: string;
  readonly emailSyncGrid: Locator;

  constructor(page: Page) {
    super(page);
    this.getEmailSyncsPath = '/Admin/Integration/EmailSync/EmailSyncList';
    this.createEmailSyncButton = this.page.getByRole('button', { name: 'Create Email Integration (Sync)' });
    this.createEmailSyncDialog = new createEmailSyncDialog(this.page);
    this.deleteEmailSyncDialog = new DeleteEmailSyncDialog(this.page);
    this.deleteEmailSyncPathRegex = /\/Admin\/Integration\/EmailSync\/\d+\/Delete/;
    this.path = '/Admin/Integration/EmailSync';
    this.emailSyncGrid = this.page.locator('#grid');
  }

  async goto() {
    const getEmailSyncsResponse = this.page.waitForResponse(this.getEmailSyncsPath);
    await this.page.goto(this.path);
    await getEmailSyncsResponse;
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
    const emailSyncRow = this.emailSyncGrid.getByRole('row', { name: emailSyncName }).first();
    const rowElement = await emailSyncRow.elementHandle();

    if (rowElement === null) {
      return;
    }

    await emailSyncRow.hover();
    await emailSyncRow.getByTitle('Delete Email Integration (Sync)').click();
    await this.deleteEmailSyncDialog.deleteButton.click();
    await this.deleteEmailSyncDialog.waitForDialogToBeDismissed();
    await rowElement.waitForElementState('hidden');
  }

  async deleteEmailSyncs(emailSyncNames: string[]) {
    for (const name of emailSyncNames) {
      await this.deleteEmailSync(name);
    }
  }

  async deleteAllTestEmailSyncs() {
    await this.goto();

    const scrollableElement = this.emailSyncGrid.locator('.k-grid-content.k-auto-scrollable').first();

    const pager = this.emailSyncGrid.locator('.k-pager-info').first();
    const pagerText = await pager.innerText();
    const totalNumOfEmailSyncs = parseInt(pagerText.trim().split(' ')[0]);

    if (Number.isNaN(totalNumOfEmailSyncs) === false) {
      const emailSyncRows = this.emailSyncGrid.getByRole('row');
      let emailSyncsCount = await emailSyncRows.count();

      while (emailSyncsCount < totalNumOfEmailSyncs) {
        const scrollResponse = this.page.waitForResponse(this.getEmailSyncsPath);
        await scrollableElement.evaluate(el => (el.scrollTop = el.scrollHeight));
        await scrollResponse;
        emailSyncsCount = await emailSyncRows.count();
      }
    }

    const deleteEmailSyncRow = this.emailSyncGrid
      .getByRole('row', { name: new RegExp(TEST_EMAIL_SYNC_NAME, 'i') })
      .last();

    let isVisible = await deleteEmailSyncRow.isVisible();

    while (isVisible) {
      await deleteEmailSyncRow.hover();
      await deleteEmailSyncRow.getByTitle('Delete Email Integration (Sync)').click();

      const deleteResponse = this.page.waitForResponse(this.deleteEmailSyncPathRegex);

      await this.deleteEmailSyncDialog.deleteButton.click();

      await deleteResponse;

      isVisible = await deleteEmailSyncRow.isVisible();
    }
  }
}
