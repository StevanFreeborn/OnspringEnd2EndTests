import { FrameLocator, Locator, Page } from '@playwright/test';
import { Dashboard } from '../../models/dashboard';
import { WaitForOptions } from '../../utils';
import { DashboardPropertiesModal } from './dashboardPropertiesModal';

export class DashboardDesignerModal {
  private readonly page: Page;
  private readonly designer: FrameLocator;
  private readonly closeButton: Locator;
  private readonly saveButton: Locator;
  private readonly saveAndCloseButton: Locator;
  private readonly savePathRegex: RegExp;
  private readonly propertiesLink: Locator;
  private readonly dashboardPropertiesModal: DashboardPropertiesModal;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.designer = this.page.frameLocator('.dialog');
    this.title = this.designer.locator('.ui-dialog-title .bcrumb-end');
    this.closeButton = this.page.getByRole('button', { name: 'Close' });
    this.saveButton = this.page.getByRole('button', { name: 'Save' });
    this.saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' });
    this.savePathRegex = /\/Admin\/Dashboard\/\d+\/Design/;
    this.propertiesLink = this.designer.getByRole('link', { name: 'Properties' });
    this.dashboardPropertiesModal = new DashboardPropertiesModal(this.designer);
  }

  async waitFor(options?: WaitForOptions) {
    await this.designer.owner().waitFor(options);
  }

  async close() {
    await this.closeButton.click();
    await this.designer.owner().waitFor({ state: 'hidden' });
  }

  private waitForSave() {
    return this.page.waitForResponse(
      res => res.url().match(this.savePathRegex) !== null && res.request().method() === 'POST'
    );
  }

  async save() {
    const saveResponse = this.waitForSave();
    await this.saveButton.click();
    await saveResponse;
  }

  async saveAndClose() {
    const saveResponse = this.waitForSave();
    await this.saveAndCloseButton.click();
    await saveResponse;
    await this.designer.owner().waitFor({ state: 'hidden' });
  }

  private async updateDashboardProperties(dashboard: Dashboard) {
    await this.propertiesLink.click();
    await this.dashboardPropertiesModal.waitFor();
    await this.dashboardPropertiesModal.fillOutForm(dashboard);
    await this.dashboardPropertiesModal.applyButton.click();
  }

  async updateDashboard(dashboard: Dashboard) {
    await this.updateDashboardProperties(dashboard);
  }
}
