import { Page } from '@playwright/test';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class DeleteContainerDialog extends BaseDeleteDialog {
  constructor(page: Page) {
    super(page);
  }
}
