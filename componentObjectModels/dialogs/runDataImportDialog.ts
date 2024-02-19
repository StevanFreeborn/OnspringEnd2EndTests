import { Locator, Page } from '@playwright/test';

export class RunDataImportDialog {
  readonly runButton: Locator;

  constructor(page: Page) {
    this.runButton = page.getByRole('button', { name: 'Run' });
  }
}
