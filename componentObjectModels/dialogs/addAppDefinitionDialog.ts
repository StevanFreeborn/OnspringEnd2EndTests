import { Locator, Page } from '@playwright/test';

export class AddAppDefinitionDialog {
  private readonly dialog: Locator;
  private readonly sourceAppSelector: Locator;
  readonly okButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.dialog = page.getByRole('dialog', { name: 'Add App Definition' });
    this.sourceAppSelector = this.dialog.locator('.label:has-text("Source App") + .data').getByRole('listbox');
    this.okButton = this.dialog.getByRole('button', { name: 'OK' });
    this.cancelButton = this.dialog.getByRole('button', { name: 'Cancel' });
  }

  async selectSourceApp(appName: string) {
    await this.sourceAppSelector.click();
    await this.dialog.page().getByRole('option', { name: appName }).click();
  }
}
