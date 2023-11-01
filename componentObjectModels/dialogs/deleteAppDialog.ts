import { Locator, Page } from '@playwright/test';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class DeleteAppDialog extends BaseDeleteDialog {
  readonly confirmationInput: Locator;

  constructor(page: Page) {
    super(page);
    this.confirmationInput = page.getByLabel('Delete App').getByRole('textbox');
  }
}
