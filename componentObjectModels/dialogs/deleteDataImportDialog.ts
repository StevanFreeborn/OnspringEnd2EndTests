import { Page } from '@playwright/test';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class DeleteDataImportDialog extends BaseDeleteDialog {
  constructor(page: Page) {
    super(page);
  }
}
