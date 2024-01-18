import { Page } from '@playwright/test';
import { BaseCreateOrAddDialogWithContinueButton } from './baseCreateOrAddDialog';

export class CreateAppDialog extends BaseCreateOrAddDialogWithContinueButton {
  constructor(page: Page) {
    super(page);
  }

  getAppToCopy(appName: string) {
    return this.getItemToCopy(appName);
  }
}
