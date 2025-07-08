import { FrameLocator, Locator } from '@playwright/test';
import { DashboardItem } from '../../models/dashboard';
import { DashboardObjectItem } from '../../models/dashboardObjectItem';
import { SavedReport } from '../../models/report';
import { DashboardDesignerObjectsTab } from '../tabs/dashboardDesignerObjectsTab';
import { DashboardDesignerReportsTab } from '../tabs/dashboardDesignerReportsTab';
import { BaseLayoutItemsSection } from './baseLayoutItemsSection';

type ObjectName = 'App Search' | 'Create Content Links' | 'Formatted Text Block' | 'Web Page';

export class DashboardResourcesSection extends BaseLayoutItemsSection {
  private readonly reportTabButton: Locator;
  private readonly keyMetricTabButton: Locator;
  private readonly layoutsTabButton: Locator;
  private readonly objectsTabButton: Locator;
  private readonly addObjectButton: Locator;
  private readonly addObjectMenu: Locator;
  private readonly reportsTab: DashboardDesignerReportsTab;
  private readonly objectsTab: DashboardDesignerObjectsTab;

  constructor(frame: FrameLocator) {
    super(frame);
    this.reportTabButton = this.getTabButton('Reports');
    this.keyMetricTabButton = this.getTabButton('Key Metrics');
    this.layoutsTabButton = this.getTabButton('Layouts');
    this.objectsTabButton = this.getTabButton('Objects');
    this.addObjectButton = this.section.getByTitle('Add Object');
    this.addObjectMenu = this.frame.locator('[data-add-menu="object"]');
    this.reportsTab = new DashboardDesignerReportsTab(frame);
    this.objectsTab = new DashboardDesignerObjectsTab(frame);
  }

  private async ensureItemTabSelected(tabButton: Locator) {
    await tabButton.waitFor();

    const tabSelected = await tabButton.getAttribute('aria-selected');
    const isTabSelected = tabSelected === 'true';

    if (isTabSelected === false) {
      await tabButton.click();
    }
  }

  async selectObjectsTab() {
    await this.ensureItemTabSelected(this.objectsTabButton);
  }

  async clickAddObjectButton(objectName: ObjectName) {
    await this.addObjectButton.click();
    await this.addObjectMenu.waitFor();
    await this.addObjectMenu.getByText(objectName).click();
  }

  async getItemFromTab(item: DashboardItem) {
    if (item instanceof SavedReport) {
      await this.ensureItemTabSelected(this.reportTabButton);
      return this.reportsTab.getReportFromBank(item.name);
    }

    if (item instanceof DashboardObjectItem) {
      await this.ensureItemTabSelected(this.objectsTabButton);
      const object = await this.objectsTab.getObjectFromBank(item.name);
      return object;
    }

    throw new Error(`Item type not supported: ${item.constructor.name}`);
  }

  async getItemFromTabByName(itemName: string) {
    await this.ensureItemTabSelected(this.objectsTabButton);
    return await this.objectsTab.getObjectFromBank(itemName);
  }

  async scrollAllObjectsIntoView() {
    return this.objectsTab.scrollAllItemsIntoView();
  }
}
