import { Page } from '@playwright/test';
import { BaseCreateOrAddDialog } from './baseCreateOrAddDialog';

export class AddLayoutItemDialog extends BaseCreateOrAddDialog {
  constructor(page: Page) {
    super(page);
  }

  getLayoutItemToCopy(itemName: string) {
    return this.getItemToCopy(itemName);
  }
}
