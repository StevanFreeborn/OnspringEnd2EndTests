import { Page } from '@playwright/test';
import { BaseCreateOrAddDialog } from './baseCreateOrAddDialog';

export class CreateAppDialog extends BaseCreateOrAddDialog {
  constructor(page: Page) {
    super(page);
  }

  getAppToCopy(appName: string) {
    return this.getItemToCopy(appName);
  }
}
