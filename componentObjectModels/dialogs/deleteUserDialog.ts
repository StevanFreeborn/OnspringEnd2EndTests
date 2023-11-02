import { Page } from '@playwright/test';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class DeleteUserDialog extends BaseDeleteDialog {
  constructor(page: Page) {
    super(page);
  }
}
