import { Page } from '@playwright/test';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class DeleteEmailBodyDialog extends BaseDeleteDialog {
  constructor(page: Page) {
    super(page);
  }
}
