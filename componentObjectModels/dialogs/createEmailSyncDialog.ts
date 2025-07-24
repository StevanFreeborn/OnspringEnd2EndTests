import { Page } from '../../fixtures';
import { BaseCreateOrAddDialogWithSaveButton } from './baseCreateOrAddDialog';

export class createEmailSyncDialog extends BaseCreateOrAddDialogWithSaveButton {
  constructor(page: Page) {
    super(page);
  }
}
