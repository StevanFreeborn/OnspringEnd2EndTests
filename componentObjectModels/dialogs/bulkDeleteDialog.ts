import { Locator, Page } from '@playwright/test';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class BulkDeleteDialog extends BaseDeleteDialog {
  private readonly progressDialog: Locator;

  constructor(page: Page) {
    super(page);
    this.progressDialog = page.getByRole('dialog', { name: 'Deleting Records' });
  }

  async confirmDelete() {
    await this.deleteButton.click();
    await this.progressDialog.waitFor();
    await this.progressDialog.waitFor({ state: 'detached' });
  }
}
