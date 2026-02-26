import { Locator, Page } from '@playwright/test';
import { CreateEmailBodyDialog } from '../dialogs/createEmailBodyDialog';
import { CreateSlackMessageDialog } from '../dialogs/createSlackMessageDialog';
import { CreateTextMessageDialog } from '../dialogs/createTextMessageDialog';
import { DeleteEmailBodyDialog } from '../dialogs/deleteEmailBodyDialog';

export class AppMessagingTab {
  readonly addEmailBodyLink: Locator;
  readonly createEmailBodyDialog: CreateEmailBodyDialog;
  readonly emailBodyGrid: Locator;
  readonly deleteEmailBodyDialog: DeleteEmailBodyDialog;

  readonly addTextMessageLink: Locator;
  readonly createTextMessageDialog: CreateTextMessageDialog;
  readonly textMessageGrid: Locator;

  readonly addSlackMessageLink: Locator;
  readonly createSlackMessageDialog: CreateSlackMessageDialog;
  readonly slackMessageGrid: Locator;

  constructor(page: Page) {
    this.addEmailBodyLink = page.getByRole('link', { name: 'Add Email Body' });
    this.createEmailBodyDialog = new CreateEmailBodyDialog(page);
    this.emailBodyGrid = page.locator('#grid-emails');
    this.deleteEmailBodyDialog = new DeleteEmailBodyDialog(page);

    this.addTextMessageLink = page.getByRole('link', { name: 'Add Text Message' });
    this.createTextMessageDialog = new CreateTextMessageDialog(page);
    this.textMessageGrid = page.locator('#grid-text-messages');

    this.addSlackMessageLink = page.getByRole('link', { name: 'Add Slack Message' });
    this.createSlackMessageDialog = new CreateSlackMessageDialog(page);
    this.slackMessageGrid = page.locator('#grid-slack-messages');
  }

  async createSlackMessage(slackMessageName: string) {
    await this.addSlackMessageLink.click();
    await this.createSlackMessageDialog.nameInput.fill(slackMessageName);
    await this.createSlackMessageDialog.saveButton.click();
  }

  async createSlackMessageCopy(slackMessageToCopy: string, slackMessageName: string) {
    await this.addSlackMessageLink.click();
    await this.createSlackMessageDialog.copyFromRadioButton.click();
    await this.createSlackMessageDialog.copyFromDropdown.click();
    await this.createSlackMessageDialog.getTextToCopy(slackMessageToCopy).click();
    await this.createSlackMessageDialog.nameInput.fill(slackMessageName);
    await this.createSlackMessageDialog.saveButton.click();
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

  async createTextMessageCopy(textToCopy: string, textMessageName: string) {
    await this.addTextMessageLink.click();
    await this.createTextMessageDialog.copyFromRadioButton.click();
    await this.createTextMessageDialog.copyFromDropdown.click();
    await this.createTextMessageDialog.getTextToCopy(textToCopy).click();
    await this.createTextMessageDialog.nameInput.fill(textMessageName);
    await this.createTextMessageDialog.saveButton.click();
  }
}
