import { Page } from '@playwright/test';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class DeleteListDialog extends BaseDeleteDialog {
  constructor(page: Page) {
    super(page);
  }
}
