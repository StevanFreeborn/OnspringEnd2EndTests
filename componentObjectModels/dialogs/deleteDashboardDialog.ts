import { Page } from '@playwright/test';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class DeleteDashboardDialog extends BaseDeleteDialog {
  constructor(page: Page) {
    super(page);
  }
}
