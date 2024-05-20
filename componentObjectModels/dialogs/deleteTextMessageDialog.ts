import { Page } from '@playwright/test';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class DeleteTextMessageDialog extends BaseDeleteDialog {
  constructor(page: Page) {
    super(page);
  }
}
