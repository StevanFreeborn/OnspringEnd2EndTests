import { Locator, Page } from '@playwright/test';

export class ReportDesignerModal {
  private readonly modal: Locator;
  private readonly saveAndRunButton: Locator;

  constructor(page: Page) {
    this.modal = page.getByRole('dialog', { name: /report designer/i });
    this.saveAndRunButton = this.modal.getByRole('button', { name: 'Save Changes & Run' });
  }

  async saveChangesAndRun() {
    await this.saveAndRunButton.click();
  }
}
