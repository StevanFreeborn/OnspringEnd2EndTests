import { Page } from '@playwright/test';
import { BaseCreateOrAddDialogWithContinueButton } from './baseCreateOrAddDialog';

export class AddObjectDialog extends BaseCreateOrAddDialogWithContinueButton {
  constructor(page: Page) {
    super(page);
  }

  getObjectToCopy(itemName: string) {
    return this.getItemToCopy(itemName);
  }
}
