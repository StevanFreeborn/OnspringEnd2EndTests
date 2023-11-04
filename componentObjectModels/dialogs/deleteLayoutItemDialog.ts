import { Page } from '@playwright/test';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class DeleteLayoutItemDialog extends BaseDeleteDialog {
  constructor(page: Page) {
    super(page);
  }
}
