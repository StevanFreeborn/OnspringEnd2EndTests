import { Page } from '../../fixtures';
import { BaseCreateOrAddDialogWithSaveButton } from './baseCreateOrAddDialog';

export class AddRecordRetentionRuleDialog extends BaseCreateOrAddDialogWithSaveButton {
  constructor(page: Page) {
    super(page);
  }
}
