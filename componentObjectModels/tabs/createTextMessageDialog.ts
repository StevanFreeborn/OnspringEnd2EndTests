import { Page } from '@playwright/test';
import { BaseCreateOrAddDialogWithSaveButton } from '../dialogs/baseCreateOrAddDialog';

export class CreateTextMessageDialog extends BaseCreateOrAddDialogWithSaveButton {
  constructor(page: Page) {
    super(page);
  }
}
