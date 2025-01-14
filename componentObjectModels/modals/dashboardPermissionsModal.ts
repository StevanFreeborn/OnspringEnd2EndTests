import { FrameLocator, Locator } from '@playwright/test';
import { Dashboard } from '../../models/dashboard';
import { WaitForOptions } from '../../utils';
import { DualPaneSelector } from '../controls/dualPaneSelector';

export class DashboardPermissionsModal {
  private readonly frame: FrameLocator;
  private readonly modal: Locator;
  private readonly dashboardPermissionsSelector: Locator;
  private readonly usersDualPaneSelector: DualPaneSelector;
  private readonly groupsDualPaneSelector: DualPaneSelector;
  private readonly rolesDualPaneSelector: DualPaneSelector;
  readonly applyButton: Locator;
  readonly cancelButton: Locator;

  constructor(frame: FrameLocator) {
    this.frame = frame;
    this.modal = this.frame.locator('#editDashboardPermissionsPopover');
    this.dashboardPermissionsSelector = this.modal
      .locator('.label:has-text("Dashboard Permissions") + .data')
      .getByRole('listbox');

    this.usersDualPaneSelector = new DualPaneSelector(
      this.modal.locator('.label:has-text("Users") + .data'),
      this.frame
    );

    this.groupsDualPaneSelector = new DualPaneSelector(
      this.modal.locator('.label:has-text("Groups") + .data'),
      this.frame
    );

    this.rolesDualPaneSelector = new DualPaneSelector(
      this.modal.locator('.label:has-text("Roles") + .data'),
      this.frame
    );

    this.applyButton = this.modal.getByRole('link', { name: 'Apply' });
    this.cancelButton = this.modal.getByRole('link', { name: 'Cancel' });
  }

  private async selectDashboardPermission(permission: string) {
    await this.dashboardPermissionsSelector.click();
    await this.frame.getByRole('option', { name: permission }).click();
  }

  async waitFor(options?: WaitForOptions) {
    await this.modal.waitFor(options);
  }

  async fillOutForm(dashboard: Dashboard) {
    await this.selectDashboardPermission(dashboard.permissionStatus);

    if (dashboard.permissionStatus === 'Private') {
      await this.usersDualPaneSelector.selectOptions(dashboard.permissions.users);
      await this.groupsDualPaneSelector.selectOptions(dashboard.permissions.groups);
      await this.rolesDualPaneSelector.selectOptions(dashboard.permissions.roles);
    }
  }
}
