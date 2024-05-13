import { Page } from '@playwright/test';
import { BaseCreateOrAddDialogWithSaveButton } from './baseCreateOrAddDialog';

export class CreateDocumentDialog extends BaseCreateOrAddDialogWithSaveButton {
  constructor(page: Page) {
    super(page);
  }
}
