import { Page } from '@playwright/test';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class DeleteRoleDialog extends BaseDeleteDialog {
  constructor(page: Page) {
    super(page);
  }
}
