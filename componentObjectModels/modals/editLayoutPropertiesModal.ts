import { FrameLocator, Locator } from '@playwright/test';

export class EditLayoutPropertiesModal {
  private readonly modal: Locator;
  readonly layoutNameInput: Locator;
  readonly layoutType: Locator;
  readonly statusToggle: Locator;
  readonly statusSwitch: Locator;
  readonly applyButton: Locator;
  readonly cancelButton: Locator;

  constructor(frame: FrameLocator) {
    this.modal = frame.locator('#editLayoutPropertiesPopover');
    this.layoutNameInput = this.modal.getByLabel('Name');
    this.layoutType = this.modal.locator('#LayoutType');
    this.statusSwitch = this.modal.getByRole('switch', { name: 'Status' });
    this.statusToggle = this.statusSwitch.locator('span').nth(3);
    this.applyButton = this.modal.getByRole('link', { name: 'Apply' });
    this.cancelButton = this.modal.getByRole('link', { name: 'Cancel' });
  }
}
