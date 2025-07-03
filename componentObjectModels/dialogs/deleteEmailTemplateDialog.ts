import { Page } from '@playwright/test';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class DeleteEmailTemplateDialog extends BaseDeleteDialog {
  constructor(page: Page) {
    super(page);
  }
}
