import { Page } from '../../fixtures';
import { BaseCreateOrAddDialogWithContinueButton } from './baseCreateOrAddDialog';

export class AddKeyMetricDialog extends BaseCreateOrAddDialogWithContinueButton {
  constructor(page: Page) {
    super(page);
  }

  getKeyMetricToCopy(itemName: string) {
    return this.getItemToCopy(itemName);
  }
}
