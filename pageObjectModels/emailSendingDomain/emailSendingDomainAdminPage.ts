import { CreateEmailSendingDomainDialog } from '../../componentObjectModels/dialogs/createEmailSendingDomainDialog';
import { DeleteEmailSendingDomainDialog } from '../../componentObjectModels/dialogs/deleteEmailSendingDomainDialog';
import { env } from '../../env';
import { Locator, Page } from '../../fixtures';
import { BaseAdminPage } from '../baseAdminPage';

export class EmailSendingDomainAdminPage extends BaseAdminPage {
  private readonly getListPath: string;
  private readonly deleteEmailSendingDomainPathRegex: RegExp;
  private readonly createEmailSendingDomainButton: Locator;
  private readonly createEmailSendingDomainDialog: CreateEmailSendingDomainDialog;
  private readonly emailSendingDomainGrid: Locator;
  private readonly deleteEmailSendingDomainDialog: DeleteEmailSendingDomainDialog;
  readonly path: string;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/EmailSendingDomain';
    this.getListPath = '/Admin/EmailSendingDomain/GetListPage';
    this.deleteEmailSendingDomainPathRegex = /Admin\/EmailSendingDomain\/\d+\/Delete/;
    this.createEmailSendingDomainButton = this.page.getByRole('button', { name: 'Create Email Sending Domain' });
    this.createEmailSendingDomainDialog = new CreateEmailSendingDomainDialog(this.page);
    this.emailSendingDomainGrid = this.page.locator('#grid');
    this.deleteEmailSendingDomainDialog = new DeleteEmailSendingDomainDialog(this.page);
  }

  async goto() {
    const response = this.page.waitForResponse(this.getListPath);
    await this.page.goto(this.path);
    await response;
  }

  private async scrollAllIntoView() {
    const scrollableElement = this.emailSendingDomainGrid.locator('.k-grid-content.k-auto-scrollable').first();

    const pager = this.emailSendingDomainGrid.locator('.k-pager-info').first();
    const pagerText = await pager.innerText();
    const totalNumOfItems = parseInt(pagerText.trim().split(' ')[0]);

    if (Number.isNaN(totalNumOfItems) === false) {
      const itemRows = this.emailSendingDomainGrid.getByRole('row');
      let itemRowsCount = await itemRows.count();

      while (itemRowsCount < totalNumOfItems) {
        const scrollResponse = this.page.waitForResponse(this.getListPath);
        await scrollableElement.evaluate(el => (el.scrollTop = el.scrollHeight));
        await scrollResponse;
        itemRowsCount = await itemRows.count();
      }
    }
  }

  async createEmailSendingDomain(emailSendingDomain: string) {
    await this.createEmailSendingDomainButton.click();
    await this.createEmailSendingDomainDialog.nameInput.fill(emailSendingDomain);
    await this.createEmailSendingDomainDialog.saveButton.click();
  }

  async deleteEmailSendingDomain(emailSendingDomain: string) {
    await this.scrollAllIntoView();

    const emailSendingDomainRow = this.emailSendingDomainGrid.getByRole('row', { name: emailSendingDomain }).first();
    const rowElement = await emailSendingDomainRow.elementHandle();

    if (rowElement === null) {
      return;
    }

    await emailSendingDomainRow.hover();
    await emailSendingDomainRow.getByTitle('Delete Email Sending Domain').click();
    await this.deleteEmailSendingDomainDialog.deleteButton.click();
    await this.deleteEmailSendingDomainDialog.waitForDialogToBeDismissed();
    await rowElement.waitForElementState('hidden');
  }

  async deleteEmailSendingDomains(emailSendingDomains: string[]) {
    for (const emailSendingDomain of emailSendingDomains) {
      await this.deleteEmailSendingDomain(emailSendingDomain);
    }
  }

  async getEmailSendingDomainRowByName(emailSendingDomain: string) {
    await this.scrollAllIntoView();
    return this.emailSendingDomainGrid.getByRole('row', { name: emailSendingDomain });
  }

  async deleteAllTestEmailSendingDomains() {
    await this.goto();
    await this.scrollAllIntoView();

    const deleteListRow = this.emailSendingDomainGrid
      .getByRole('row', { name: new RegExp(env.CUSTOM_EMAIL_SENDING_DOMAIN, 'i') })
      .last();

    let isVisible = await deleteListRow.isVisible();

    while (isVisible) {
      await deleteListRow.hover();
      await deleteListRow.getByTitle('Delete Email Sending Domain').click();

      const deleteResponse = this.page.waitForResponse(this.deleteEmailSendingDomainPathRegex);

      await this.deleteEmailSendingDomainDialog.deleteButton.click();

      await deleteResponse;

      isVisible = await deleteListRow.isVisible();
    }
  }
}
