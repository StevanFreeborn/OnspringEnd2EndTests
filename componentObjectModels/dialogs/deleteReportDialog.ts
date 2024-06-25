import { Page } from '@playwright/test';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class DeleteReportDialog extends BaseDeleteDialog {
  constructor(page: Page) {
    super(page);
  }
}
