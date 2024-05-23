import { Locator, Page } from '@playwright/test';
import { BaseCreateOrAddDialogWithSaveButton } from './baseCreateOrAddDialog';

export class CreateDynamicDocumentDialog extends BaseCreateOrAddDialogWithSaveButton {
  constructor(page: Page) {
    super(page);
  }

  getDocumentToCopy(documentName: string) {
    return this.getItemToCopy(documentName);
  }
}

export class CreateDynamicDocumentDialogForApp extends CreateDynamicDocumentDialog {
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
