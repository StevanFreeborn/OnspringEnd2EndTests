import { Page } from '../../fixtures';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class DeleteEmailSendingDomainDialog extends BaseDeleteDialog {
  constructor(page: Page) {
    super(page);
  }
}
