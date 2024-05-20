import { Locator, Page } from '@playwright/test';
import { DeleteTextMessageDialog } from '../../componentObjectModels/dialogs/deleteTextMessageDialog';
import { CreateTextMessageDialogForApp } from '../../componentObjectModels/tabs/createTextMessageDialog';
import { BaseAdminPage } from '../baseAdminPage';

export class TextMessageAdminPage extends BaseAdminPage {
  readonly path: string;
  readonly createTextMessageButton: Locator;
  readonly createTextDialog: CreateTextMessageDialogForApp;
  readonly textMessageGrid: Locator;
  readonly deleteTextMessageDialog: DeleteTextMessageDialog;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Messaging/TextMessage';
    this.createTextMessageButton = page.getByRole('button', { name: 'Create Text Message' });
    this.createTextDialog = new CreateTextMessageDialogForApp(page);
    this.textMessageGrid = page.locator('#grid');
    this.deleteTextMessageDialog = new DeleteTextMessageDialog(page);
  }

  async goto() {
    await this.page.goto(this.path);
  }

  async createTextMessage(appName: string, textMessageName: string) {
    await this.createTextMessageButton.click();

    await this.createTextDialog.nameInput.waitFor();
    await this.createTextDialog.nameInput.fill(textMessageName);
    await this.createTextDialog.selectApp(appName);
    await this.createTextDialog.saveButton.click();
  }
}
