import { Locator } from '@playwright/test';

export class OutcomeGeneralTab {
  readonly nameInput: Locator;
  readonly descriptionEditor: Locator;
  readonly statusToggle: Locator;
  readonly statusSwitch: Locator;

  constructor(modal: Locator) {
    this.nameInput = modal.getByLabel('Name');
    this.descriptionEditor = modal.locator('.content-area.mce-content-body');
    this.statusSwitch = modal.getByRole('switch');
    this.statusToggle = this.statusSwitch.locator('span').nth(3);
  }
}
