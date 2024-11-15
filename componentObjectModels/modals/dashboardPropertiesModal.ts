import { FrameLocator, Locator } from '@playwright/test';
import { Dashboard } from '../../models/dashboard';
import { WaitForOptions } from '../../utils';

export class DashboardPropertiesModal {
  private readonly frame: FrameLocator;
  private readonly modal: Locator;
  private readonly nameInput: Locator;
  readonly applyButton: Locator;
  readonly cancelButton: Locator;

  constructor(frame: FrameLocator) {
    this.frame = frame;
    this.modal = this.frame.locator('#editDashboardPropertiesPopover');
    this.nameInput = this.modal.getByLabel('Name');
    this.applyButton = this.modal.getByRole('link', { name: 'Apply' });
    this.cancelButton = this.modal.getByRole('link', { name: 'Cancel' });
  }

  async waitFor(options?: WaitForOptions) {
    await this.modal.waitFor(options);
  }

  async fillOutForm(dashboard: Dashboard) {
    await this.nameInput.fill(dashboard.name);
  }
}
