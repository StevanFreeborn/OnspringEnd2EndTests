import { Page } from '@playwright/test';
import { BaseCreateOrAddDialogWithSaveButton } from './baseCreateOrAddDialog';

export class CreateApiKeyDialog extends BaseCreateOrAddDialogWithSaveButton {
  constructor(page: Page) {
    super(page);
  }

  getApiKeyToCopy(appName: string) {
    return this.getItemToCopy(appName);
  }
}