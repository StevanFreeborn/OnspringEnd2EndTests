import { Locator, Page } from '@playwright/test';
import { LayoutItem } from '../../models/layoutItem';
import { ListField } from '../../models/listField';

export class BulkEditModal {
  private readonly modal: Locator;
  private readonly saveButton: Locator;
  private readonly progressDialog: Locator;

  constructor(page: Page) {
    this.modal = page.getByRole('dialog', { name: /bulk edit/i });
    this.saveButton = this.modal.getByRole('button', { name: 'Save' });
    this.progressDialog = page.getByRole('dialog', { name: /updating records/i });
  }

  private getFieldLocator(field: LayoutItem) {
    return this.modal.locator(`.label:has-text("${field.name}") + .data`);
  }

  async updateFields(updates: { field: LayoutItem; value: string }[]) {
    for (const update of updates) {
      if (update.field instanceof ListField) {
        const field = this.getFieldLocator(update.field);
        await field.click();
        await field.page().getByRole('option', { name: update.value }).click();
      }
    }
  }

  async saveChanges() {
    await this.saveButton.click();
    await this.progressDialog.waitFor();
    await this.progressDialog.waitFor({ state: 'hidden' });
  }
}
