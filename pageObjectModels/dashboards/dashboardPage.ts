import { Locator, Page } from '@playwright/test';
import { ExportUnderwayDialog } from '../../componentObjectModels/dialogs/reportExportUnderwayDialog';
import { DashboardActionMenu } from '../../componentObjectModels/menus/dashboardActionMenu';
import { DashboardDesignerModal } from '../../componentObjectModels/modals/dashboardDesignerModal';
import { DashboardLinkModal } from '../../componentObjectModels/modals/dashboardLinkModal';
import { ExportDashboardModal } from '../../componentObjectModels/modals/exportDashboardModal';
import { PrintDashboardModal } from '../../componentObjectModels/modals/printDashboardModal';
import { BasePage } from '../basePage';

export class DashboardPage extends BasePage {
  private actionMenuButton: Locator;
  private actionMenu: DashboardActionMenu;
  private dashboardContents: Locator;
  readonly path: string;
  readonly dashboardDesigner: DashboardDesignerModal;
  readonly printDashboardModal: PrintDashboardModal;
  readonly exportDashboardModal: ExportDashboardModal;
  readonly exportUnderwayDialog: ExportUnderwayDialog;
  readonly dashboardLinkModal: DashboardLinkModal;
  readonly dashboardBreadcrumbTitle: Locator;
  readonly dashboardTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.path = '/Dashboard';
    this.actionMenuButton = this.page.locator('#breadcrumb-action-menu-button');
    this.actionMenu = new DashboardActionMenu(this.page.locator('#dashboard-action-menu'));
    this.dashboardDesigner = new DashboardDesignerModal(this.page);
    this.printDashboardModal = new PrintDashboardModal(this.page);
    this.exportDashboardModal = new ExportDashboardModal(this.page);
    this.exportUnderwayDialog = new ExportUnderwayDialog(this.page);
    this.dashboardLinkModal = new DashboardLinkModal(this.page);
    this.dashboardBreadcrumbTitle = this.page.locator('#dashboard-breadcrumbs .bcrumb-end');
    this.dashboardTitle = this.page.locator('#dashboard-title-container');
    this.dashboardContents = this.page.locator('#dashboard-contents');
  }

  async goto(dashboardId?: number) {
    const path = dashboardId ? `${this.path}/${dashboardId}` : this.path;
    await this.page.goto(path);
    await this.copyrightPatentInfo.waitFor({ state: 'hidden' });
  }

  async openDashboardDesigner() {
    await this.actionMenuButton.click();
    await this.actionMenu.editDashboardLink.click();
    await this.dashboardDesigner.waitFor();
  }

  async printDashboard() {
    await this.actionMenuButton.click();
    await this.actionMenu.printDashboardLink.click();
    await this.printDashboardModal.waitFor();
    await this.printDashboardModal.okButton.click();
  }

  async exportDashboard() {
    await this.actionMenuButton.click();
    await this.actionMenu.exportDashboardLink.click();

    await this.exportDashboardModal.okButton.click();

    await this.exportUnderwayDialog.waitFor();
    await this.exportUnderwayDialog.close();
  }

  async getDashboardLink() {
    await this.actionMenuButton.click();
    await this.actionMenu.getDashboardUrlLink.click();

    await this.dashboardLinkModal.waitFor();

    const linkLocator = await this.dashboardLinkModal.getLink();
    const textWithLink = await linkLocator.textContent();
    const link = textWithLink?.match(/https:\/\/.*\/Dashboard\/\d+/);

    if (link === null || link === undefined) {
      throw new Error('Link not found');
    }

    return link[0];
  }

  getDashboardItem(name: string) {
    return this.dashboardContents.locator('.dashboard-item', { has: this.page.locator(`.title:has-text("${name}")`) });
  }
}
