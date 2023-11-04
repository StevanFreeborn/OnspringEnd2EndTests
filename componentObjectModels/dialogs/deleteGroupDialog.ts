import { Page } from '@playwright/test';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class DeleteGroupDialog extends BaseDeleteDialog {
  constructor(page: Page) {
    super(page);
  }
}
