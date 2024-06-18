import { Page } from '@playwright/test';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class DeleteDataConnectorDialog extends BaseDeleteDialog {
  constructor(page: Page) {
    super(page);
  }
}
