import { Locator, Page } from '@playwright/test';
import { BaseDeleteDialogComponent } from './baseDeleteDialogComponent';

export class DeleteAppDialogComponent extends BaseDeleteDialogComponent {
  readonly confirmationInput: Locator;

  constructor(page: Page) {
    super(page);
    this.confirmationInput = page.getByLabel('Delete App').getByRole('textbox');
  }
}
