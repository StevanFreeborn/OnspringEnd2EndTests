import { Page } from '@playwright/test';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class DeleteDocumentDialog extends BaseDeleteDialog {
  constructor(page: Page) {
    super(page);
  }
}
