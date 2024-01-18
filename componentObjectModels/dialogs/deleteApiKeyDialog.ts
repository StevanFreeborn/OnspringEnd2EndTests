import { Page } from '@playwright/test';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class DeleteApiKeyDialog extends BaseDeleteDialog {
  constructor(page: Page) {
    super(page);
  }
}
