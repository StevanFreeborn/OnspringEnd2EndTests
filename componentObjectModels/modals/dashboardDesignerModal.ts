import { FrameLocator, Locator, Page } from '@playwright/test';
import { Dashboard, DashboardItem, DashboardSchedule } from '../../models/dashboard';
import { WaitForOptions } from '../../utils';
import { DashboardCanvasSection } from '../sections/dashboardCanvasSection';
import { DashboardResourcesSection } from '../sections/dashboardResourcesSection';
import { DashboardPermissionsModal } from './dashboardPermissionsModal';
import { DashboardPropertiesModal } from './dashboardPropertiesModal';
import { ScheduleDashboardExportModal } from './scheduleDashboardExportModal';

export class DashboardDesignerModal {
  private readonly page: Page;
  private readonly designer: FrameLocator;
  private readonly closeButton: Locator;
  private readonly saveButton: Locator;
  private readonly saveAndCloseButton: Locator;
  private readonly savePathRegex: RegExp;
  private readonly propertiesLink: Locator;
  private readonly permissionsLink: Locator;
  private readonly schedulingLink: Locator;
  private readonly dashboardPropertiesModal: DashboardPropertiesModal;
  private readonly dashboardPermissionsModal: DashboardPermissionsModal;
  private readonly schedulingModal: ScheduleDashboardExportModal;
  private readonly resourcesSection: DashboardResourcesSection;
  private readonly canvasSection: DashboardCanvasSection;
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
    this.permissionsLink = this.designer.getByRole('link', { name: 'Permissions' });
    this.schedulingLink = this.designer.getByRole('link', { name: 'Scheduling' });
    this.dashboardPropertiesModal = new DashboardPropertiesModal(this.designer);
    this.dashboardPermissionsModal = new DashboardPermissionsModal(this.designer);
    this.schedulingModal = new ScheduleDashboardExportModal(this.page);
    this.resourcesSection = new DashboardResourcesSection(this.designer);
    this.canvasSection = new DashboardCanvasSection(this.designer);
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

  private async updateDashboardPermissions(dashboard: Dashboard) {
    await this.permissionsLink.click();
    await this.dashboardPermissionsModal.waitFor();
    await this.dashboardPermissionsModal.fillOutForm(dashboard);
    await this.dashboardPermissionsModal.applyButton.click();
  }

  private async updateDashboardScheduling(schedule: DashboardSchedule) {
    await this.schedulingLink.click();
    await this.schedulingModal.waitFor();
    await this.schedulingModal.fillOutForm(schedule);
    await this.schedulingModal.save();
  }

  private async addItemToDashboard(item: DashboardItem) {
    const itemToDrag = await this.resourcesSection.getItemFromTab(item);
    const itemToDragClasses = await itemToDrag.getAttribute('class');

    // TODO: If already on the dashboard we probably
    // want to support being able to move it if
    // the column/row is different
    if (itemToDragClasses?.includes('ui-draggable-disabled')) {
      return;
    }

    const itemDropzone = await this.canvasSection.getItemDropzone(item.row, item.column);

    await itemToDrag.hover();
    await this.page.mouse.down();
    await itemDropzone.hover();
    await this.canvasSection.layoutItemDropzone.waitFor({ state: 'visible' });
    await this.page.mouse.up();

    return { itemToDrag, itemDropzone };
  }

  private async addDashboardItems(items: DashboardItem[]) {
    for (const item of items) {
      await this.addItemToDashboard(item);
    }
  }

  async updateDashboard(dashboard: Dashboard) {
    if (dashboard.schedule) {
      await this.updateDashboardScheduling(dashboard.schedule);
    }

    await this.updateDashboardProperties(dashboard);
    await this.updateDashboardPermissions(dashboard);
    await this.addDashboardItems(dashboard.items);
  }

  async getDashboardId() {
    await this.propertiesLink.click();
    await this.dashboardPropertiesModal.waitFor();

    const link = await this.dashboardPropertiesModal.getDashboardLink();

    await this.dashboardPropertiesModal.cancelButton.click();

    const id = link.split('/').pop();

    if (id === undefined) {
      throw new Error('Dashboard ID not found');
    }

    return parseInt(id);
  }
}
