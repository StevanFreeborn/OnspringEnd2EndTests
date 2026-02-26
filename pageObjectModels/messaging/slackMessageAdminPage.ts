import { Locator, Page } from '@playwright/test';
import { CreateSlackMessageDialogForApp } from '../../componentObjectModels/dialogs/createSlackMessageDialog';
import { DeleteSlackMessageDialog } from '../../componentObjectModels/dialogs/deleteSlackMessageDialog';
import { BaseAdminPage } from '../baseAdminPage';

export class SlackMessageAdminPage extends BaseAdminPage {
  readonly path: string;
  readonly createSlackMessageButton: Locator;
  readonly createSlackMessageDialog: CreateSlackMessageDialogForApp;
  readonly slackMessageGrid: Locator;
  readonly deleteSlackMessageDialog: DeleteSlackMessageDialog;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Messaging/Slack';
    this.createSlackMessageButton = page.getByRole('button', { name: 'Create Slack Message' });
    this.createSlackMessageDialog = new CreateSlackMessageDialogForApp(page);
    this.slackMessageGrid = page.locator('#grid');
    this.deleteSlackMessageDialog = new DeleteSlackMessageDialog(page);
  }

  async goto() {
    await this.page.goto(this.path);
  }

  async createSlackMessage(appName: string, slackMessageName: string) {
    await this.createSlackMessageButton.click();

    await this.createSlackMessageDialog.nameInput.waitFor();
    await this.createSlackMessageDialog.nameInput.fill(slackMessageName);
    await this.createSlackMessageDialog.selectApp(appName);
    await this.createSlackMessageDialog.saveButton.click();
  }

  async createSlackMessageCopy(appName: string, slackMessageToCopy: string, slackMessageCopyName: string) {
    await this.createSlackMessageButton.click();

    await this.createSlackMessageDialog.copyFromRadioButton.waitFor();
    await this.createSlackMessageDialog.selectApp(appName);
    await this.createSlackMessageDialog.copyFromRadioButton.click();
    await this.createSlackMessageDialog.copyFromDropdown.click();
    await this.createSlackMessageDialog.getTextToCopy(slackMessageToCopy).click();
    await this.createSlackMessageDialog.nameInput.fill(slackMessageCopyName);
    await this.createSlackMessageDialog.saveButton.click();
  }
}
