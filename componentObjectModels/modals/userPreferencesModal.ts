import { FrameLocator, Locator, Page } from '@playwright/test';
import { WaitForOptions } from '../../utils';

export class UserPreferencesModal {
  private readonly modal: Locator;
  private readonly frame: FrameLocator;
  private readonly defaultDashboardPlaceholder: Locator;
  private readonly defaultDashboardMethodSelector: Locator;
  private readonly defaultDashboardSelector: Locator;
  private readonly saveButton: Locator;
  private readonly cancelButton: Locator;

  constructor(page: Page) {
    this.modal = page.getByRole('dialog', { name: 'User Preferences' });
    this.frame = this.modal.frameLocator('iframe');
    this.defaultDashboardPlaceholder = this.frame.locator('.label:has-text("My Default Dashboard") + .text');
    this.defaultDashboardMethodSelector = this.frame
      .locator('.label:has-text("My Default Dashboard") + .data')
      .getByRole('listbox');
    this.defaultDashboardSelector = this.frame.locator('[data-dashboard-row]').getByRole('listbox');
    this.saveButton = this.modal.getByRole('button', { name: 'Save' });
    this.cancelButton = this.modal.getByRole('button', { name: 'Cancel' });
  }

  async waitFor(options?: WaitForOptions) {
    await this.modal.waitFor(options);
  }

  private async selectDashboardMethod(method: string) {
    await this.defaultDashboardMethodSelector.click();
    await this.frame.getByRole('option', { name: method }).click();
  }

  private async selectDashboard(dashboardName: string) {
    await this.defaultDashboardSelector.click();
    await this.frame.getByRole('option', { name: dashboardName }).click();
  }

  async selectDefaultDashboard(dashboardName: string) {
    const isPlaceHolderVisible = await this.defaultDashboardPlaceholder.isVisible();

    if (isPlaceHolderVisible) {
      throw new Error('Default dashboard is not configurable');
    }

    await this.selectDashboardMethod('Selected Dashboard');
    await this.selectDashboard(dashboardName);
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }
}
