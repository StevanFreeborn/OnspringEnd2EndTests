import { Page } from '@playwright/test';
import { BaseCreateOrAddDialogWithContinueButton } from './baseCreateOrAddDialog';

export class AddLayoutItemDialog extends BaseCreateOrAddDialogWithContinueButton {
  constructor(page: Page) {
    super(page);
  }

  getLayoutItemToCopy(itemName: string) {
    return this.getItemToCopy(itemName);
  }
}
