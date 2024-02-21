import { Page } from '@playwright/test';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class DeleteRecordDialog extends BaseDeleteDialog {
  constructor(page: Page) {
    super(page);
  }
}
