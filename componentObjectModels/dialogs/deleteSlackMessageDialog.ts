import { Page } from '@playwright/test';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class DeleteSlackMessageDialog extends BaseDeleteDialog {
  constructor(page: Page) {
    super(page);
  }
}
