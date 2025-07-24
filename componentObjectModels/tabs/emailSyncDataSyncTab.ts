import { Locator, Page } from '../../fixtures';

export class EmailSyncDataSyncTab {
  readonly nameInput: Locator;

  constructor(page: Page) {
    this.nameInput = page.locator('.label:has-text("Name") + .data').getByRole('textbox');
  }
}
