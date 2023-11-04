import { Locator, Page } from '@playwright/test';
import { BaseCreateOrAddDialog } from './baseCreateOrAddDialog';

export class CreateAppDialog extends BaseCreateOrAddDialog {
  readonly selectAnAppDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.selectAnAppDropdown = this.getSelectDropdown('Create app', 'Select an app');
  }

  getAppToCopy(appName: string) {
    return this.getItemToCopy(appName);
  }
}
