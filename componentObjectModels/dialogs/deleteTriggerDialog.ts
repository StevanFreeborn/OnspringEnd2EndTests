import { Page } from '@playwright/test';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class DeleteTriggerDialog extends BaseDeleteDialog {
  constructor(page: Page) {
    super(page);
  }
}
