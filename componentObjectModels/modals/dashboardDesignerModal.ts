import { FrameLocator, Locator, Page } from '@playwright/test';
import { TEST_DASHBOARD_OBJECT_NAME } from '../../factories/fakeDataFactory';
import { AppSearch } from '../../models/appSearch';
import { CreateContentLinks } from '../../models/createContentLinks';
import { Dashboard, DashboardItemWithLocation, DashboardSchedule } from '../../models/dashboard';
import { DashboardFormattedTextBlock } from '../../models/dashboardFormattedTextBlock';
import { DashboardObjectItem } from '../../models/dashboardObjectItem';
import { KeyMetric } from '../../models/keyMetric';
import { WebPage } from '../../models/webPage';
import { WaitForOptions } from '../../utils';
import { AddKeyMetricDialog } from '../dialogs/addKeyMetricDialog';
import { AddObjectDialog } from '../dialogs/addObjectDialog';
import { DeleteDashboardObjectDialog } from '../dialogs/deleteDashboardObjectDialog';
import { DashboardCanvasSection } from '../sections/dashboardCanvasSection';
import { DashboardResourcesSection } from '../sections/dashboardResourcesSection';
import { AddOrEditAppSearchObjectModal } from './addOrEditAppSearchObjectModal';
import { AddOrEditCreateContentLinksObjectModal } from './addOrEditCreateContentLinksObjectModal';
import { AddOrEditFormattedTextBlockObjectModal } from './addOrEditFormattedTextBlockObjectModal';
import { AddOrEditKeyMetricModal } from './addOrEditKeyMetricModal';
import { AddOrEditWebPageObjectModal } from './addOrEditWebPageObjectModal';
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
  private readonly addObjectDialog: AddObjectDialog;
  private readonly addKeyMetricDialog: AddKeyMetricDialog;
  private readonly appSearchObjectModal: AddOrEditAppSearchObjectModal;
  private readonly createContentLinksObjectModal: AddOrEditCreateContentLinksObjectModal;
  private readonly formattedTextBlockObjectModal: AddOrEditFormattedTextBlockObjectModal;
  private readonly webPageObjectModal: AddOrEditWebPageObjectModal;
  private readonly addKeyMetricModal: AddOrEditKeyMetricModal;
  private readonly deleteDashboardObjectDialog: DeleteDashboardObjectDialog;
  private readonly deleteDashboardObjectPathRegex: RegExp;
  private readonly getMoreObjectsPathRegex: RegExp;
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
    this.addObjectDialog = new AddObjectDialog(this.page);
    this.addKeyMetricDialog = new AddKeyMetricDialog(this.page);
    this.appSearchObjectModal = new AddOrEditAppSearchObjectModal(this.page);
    this.createContentLinksObjectModal = new AddOrEditCreateContentLinksObjectModal(this.page);
    this.formattedTextBlockObjectModal = new AddOrEditFormattedTextBlockObjectModal(this.page);
    this.webPageObjectModal = new AddOrEditWebPageObjectModal(this.page);
    this.addKeyMetricModal = new AddOrEditKeyMetricModal(this.page);
    this.deleteDashboardObjectDialog = new DeleteDashboardObjectDialog(this.page);
    this.deleteDashboardObjectPathRegex = /\/Admin\/Dashboard\/DashboardObject\/\d+\/Delete/;
    this.getMoreObjectsPathRegex = /\/Admin\/Dashboard\/GetMoreObjectListItems/;
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

  private async addItemToDashboard(item: DashboardItemWithLocation) {
    const itemToDrag = await this.resourcesSection.getItemFromTab(item.item);
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

  private async addDashboardItems(items: DashboardItemWithLocation[]) {
    for (const item of items) {
      await this.addItemToDashboard(item);
    }
  }

  private async enterAndSaveDashboardObject(dashboardObject: DashboardObjectItem) {
    switch (dashboardObject.type) {
      case 'App Search':
        await this.appSearchObjectModal.fillOutForm(dashboardObject as AppSearch);
        await this.appSearchObjectModal.save();
        break;
      case 'Create Content Links':
        await this.createContentLinksObjectModal.fillOutForm(dashboardObject as CreateContentLinks);
        await this.createContentLinksObjectModal.save();
        break;
      case 'Formatted Text Block':
        await this.formattedTextBlockObjectModal.fillOutForm(dashboardObject as DashboardFormattedTextBlock);
        await this.formattedTextBlockObjectModal.save();
        break;
      case 'Web Page':
        await this.webPageObjectModal.fillOutForm(dashboardObject as WebPage);
        await this.webPageObjectModal.save();
        break;
      default:
        throw new Error(`Unknown dashboard object type: ${dashboardObject.type}`);
    }
  }

  private async enterAndSaveKeyMetric(keyMetric: KeyMetric) {
    await this.addKeyMetricModal.fillOutForm(keyMetric);
    await this.addKeyMetricModal.save();
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

  async addDashboardObject(dashboardObject: DashboardObjectItem) {
    await this.resourcesSection.selectObjectsTab();
    await this.resourcesSection.clickAddObjectButton(dashboardObject.type);
    await this.addObjectDialog.continueButton.waitFor();
    await this.addObjectDialog.continueButton.click();
    await this.enterAndSaveDashboardObject(dashboardObject);
  }

  async updateDashboardObject(
    existingDashboardObject: DashboardObjectItem,
    updatedDashboardObject: DashboardObjectItem
  ) {
    await this.resourcesSection.selectObjectsTab();

    const item = await this.resourcesSection.getItemFromTab(existingDashboardObject);
    await item.hover();
    await item.getByTitle('Edit Object Properties').click();

    await this.enterAndSaveDashboardObject(updatedDashboardObject);
  }

  async deleteDashboardObject(dashboardObject: DashboardObjectItem) {
    await this.resourcesSection.selectObjectsTab();
    const item = await this.resourcesSection.getItemFromTab(dashboardObject);

    await item.hover();
    await item.getByTitle('Delete Object').click();
    await this.deleteDashboardObjectDialog.dialog.waitFor();
    await this.deleteDashboardObjectDialog.deleteButton.click();
    await this.deleteDashboardObjectDialog.dialog.waitFor({ state: 'hidden' });
    await item.waitFor({ state: 'hidden' });
  }

  async deleteAllDashboardObjects() {
    await this.resourcesSection.selectObjectsTab();
    await this.resourcesSection.scrollAllObjectsIntoView();

    const item = await this.resourcesSection.getItemFromTabByName(TEST_DASHBOARD_OBJECT_NAME);
    const object = item.last();

    let isVisible = await object.isVisible();

    while (isVisible) {
      await object.hover();
      await object.getByTitle('Delete Object').click();
      await this.deleteDashboardObjectDialog.dialog.waitFor();

      const deleteResponse = this.page.waitForResponse(this.deleteDashboardObjectPathRegex);
      const getMoreObjectsResponse = this.page.waitForResponse(this.getMoreObjectsPathRegex);

      await this.deleteDashboardObjectDialog.deleteButton.click();
      await deleteResponse;
      await this.deleteDashboardObjectDialog.dialog.waitFor({ state: 'hidden' });
      await getMoreObjectsResponse;

      isVisible = await object.isVisible();
    }
  }

  async addKeyMetric(keyMetric: KeyMetric) {
    await this.resourcesSection.selectKeyMetricsTab();
    await this.resourcesSection.clickAddKeyMetricButton(keyMetric.type);
    await this.addKeyMetricDialog.continueButton.waitFor();
    await this.addKeyMetricDialog.continueButton.click();
    await this.enterAndSaveKeyMetric(keyMetric);
  }
}
