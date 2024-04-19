import { FrameLocator, Locator } from '@playwright/test';

export class TriggerGeneralTab {
  readonly nameInput: Locator;
  readonly descriptionEditor: Locator;
  readonly statusToggle: Locator;
  readonly statusSwitch: Locator;

  constructor(frame: FrameLocator) {
    this.nameInput = frame.getByLabel('Name');
    this.descriptionEditor = frame.locator('.content-area.mce-content-body');
    this.statusSwitch = frame.getByRole('switch', { name: 'Status' });
    this.statusToggle = this.statusSwitch.locator('span').nth(3);
  }
}
