import { FrameLocator, Locator } from '@playwright/test';
import { Dashboard } from '../../models/dashboard';
import { WaitForOptions } from '../../utils';
import { DualPaneSelector } from '../controls/dualPaneSelector';

export class DashboardPropertiesModal {
  private readonly frame: FrameLocator;
  private readonly modal: Locator;
  private readonly nameInput: Locator;
  private readonly dashboardLink: Locator;
  private readonly containersSelector: DualPaneSelector;
  readonly applyButton: Locator;
  readonly cancelButton: Locator;

  constructor(frame: FrameLocator) {
    this.frame = frame;
    this.modal = this.frame.locator('#editDashboardPropertiesPopover');
    this.nameInput = this.modal.getByLabel('Name');
    this.dashboardLink = this.modal.locator('.label:has-text("Dashboard Link") + .text');
    this.containersSelector = new DualPaneSelector(
      this.modal.locator('.label:has-text("Container(s)") + .data'),
      this.frame
    );
    this.applyButton = this.modal.getByRole('link', { name: 'Apply' });
    this.cancelButton = this.modal.getByRole('link', { name: 'Cancel' });
  }

  async waitFor(options?: WaitForOptions) {
    await this.modal.waitFor(options);
  }

  async fillOutForm(dashboard: Dashboard) {
    await this.nameInput.fill(dashboard.name);
    await this.containersSelector.selectOptions(dashboard.containers);
  }

  async getDashboardLink() {
    const text = await this.dashboardLink.innerText();
    return text.trim();
  }
}
