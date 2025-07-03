import { Page } from '@playwright/test';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class DeleteLayoutDialog extends BaseDeleteDialog {
  constructor(page: Page) {
    super(page);
  }
}
