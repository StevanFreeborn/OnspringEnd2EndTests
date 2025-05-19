import { Page } from '@playwright/test';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class DeleteDashboardObjectDialog extends BaseDeleteDialog {
  constructor(page: Page) {
    super(page);
  }
}
