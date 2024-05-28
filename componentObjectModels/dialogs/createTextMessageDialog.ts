import { Locator, Page } from '@playwright/test';
import { BaseCreateOrAddDialogWithSaveButton } from './baseCreateOrAddDialog';

export class CreateTextMessageDialog extends BaseCreateOrAddDialogWithSaveButton {
  constructor(page: Page) {
    super(page);
  }

  getTextToCopy(textName: string) {
    return this.getItemToCopy(textName);
  }
}

export class CreateTextMessageDialogForApp extends CreateTextMessageDialog {
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
