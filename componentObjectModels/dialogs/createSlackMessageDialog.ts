import { Locator, Page } from '../../fixtures';
import { BaseCreateOrAddDialogWithSaveButton } from './baseCreateOrAddDialog';

export class CreateSlackMessageDialog extends BaseCreateOrAddDialogWithSaveButton {
  constructor(page: Page) {
    super(page);
  }

  getTextToCopy(slackMessageName: string) {
    return this.getItemToCopy(slackMessageName);
  }
}

export class CreateSlackMessageDialogForApp extends CreateSlackMessageDialog {
  private readonly appSelect: Locator;

  constructor(page: Page) {
    super(page);
    this.appSelect = this.page.getByRole('listbox', { name: 'App/Survey' });
  }

  async selectApp(appName: string) {
    await this.appSelect.click();
    await this.page.getByRole('option', { name: appName }).click();
  }
}
