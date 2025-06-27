import { FrameLocator, Locator } from '@playwright/test';

export class EditTabSetModal {
  private readonly modal: FrameLocator;
  private readonly tabGrid: Locator;
  readonly applyButton: Locator;

  constructor(frame: FrameLocator) {
    this.modal = frame;
    this.tabGrid = this.modal.locator('.grid');
    this.applyButton = this.modal.getByRole('link', { name: 'Apply' });
  }

  async deleteTab(tabName: string) {
    const row = this.tabGrid.getByRole('row', { name: tabName });
    const deleteButton = row.locator('[data-delete]');

    await deleteButton.click();
  }
}
