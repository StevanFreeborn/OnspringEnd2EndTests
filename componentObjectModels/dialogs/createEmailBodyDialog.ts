import { Page } from '@playwright/test';
import { BaseCreateOrAddDialogWithSaveButton } from './baseCreateOrAddDialog';

export class CreateEmailBodyDialog extends BaseCreateOrAddDialogWithSaveButton {
  constructor(page: Page) {
    super(page);
  }

  getEmailBodyToCopy(emailBodyName: string) {
    return this.getItemToCopy(emailBodyName);
  }
}
