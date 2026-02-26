import { Page } from '../../fixtures';
import { BaseCreateOrAddDialogWithSaveButton } from './baseCreateOrAddDialog';

export class CreateSlackMessageDialog extends BaseCreateOrAddDialogWithSaveButton {
  constructor(page: Page) {
    super(page);
  }

  getTextToCopy(slackMessageName: string) {
    return this.getItemToCopy(slackMessageName);
  }
}
