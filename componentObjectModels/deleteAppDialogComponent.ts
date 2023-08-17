import { Locator, Page } from '@playwright/test';

export class DeleteAppDialogComponent {
  readonly page: Page;
  readonly dialog: Locator;
  readonly confirmationInput: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.locator('#extra-confirmation');
    this.confirmationInput = page.locator('#extra-confirmation input');
    this.deleteButton = page.getByRole('button', { name: 'Delete' });
  }
}
