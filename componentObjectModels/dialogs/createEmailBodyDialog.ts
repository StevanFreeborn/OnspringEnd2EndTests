import { Locator, Page } from '@playwright/test';
import { BaseCreateOrAddDialogWithSaveButton } from './baseCreateOrAddDialog';

export class CreateEmailBodyDialog extends BaseCreateOrAddDialogWithSaveButton {
  constructor(page: Page) {
    super(page);
  }

  getEmailBodyToCopy(emailBodyName: string) {
    return this.getItemToCopy(emailBodyName);
  }
}

export class CreateEmailBodyDialogForApp extends CreateEmailBodyDialog {
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
