import { Page } from '@playwright/test';
import { BaseCreateOrAddDialogWithSaveButton } from './baseCreateOrAddDialog';

export class CreateApiKeyDialog extends BaseCreateOrAddDialogWithSaveButton {
  constructor(page: Page) {
    super(page);
  }

  getApiKeyToCopy(apiKey: string) {
    return this.getItemToCopy(apiKey);
  }
}
