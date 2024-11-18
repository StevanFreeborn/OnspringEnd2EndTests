import { Locator, Page } from '@playwright/test';
import { DashboardActionMenu } from '../../componentObjectModels/menus/dashboardActionMenu';
import { DashboardDesignerModal } from '../../componentObjectModels/modals/dashboardDesignerModal';
import { BasePage } from '../basePage';

export class DashboardPage extends BasePage {
  private actionMenuButton: Locator;
  private actionMenu: DashboardActionMenu;
  readonly path: string;
  readonly dashboardDesigner: DashboardDesignerModal;
  readonly dashboardTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.path = '/Dashboard';
    this.actionMenuButton = this.page.locator('#breadcrumb-action-menu-button');
    this.actionMenu = new DashboardActionMenu(this.page.locator('#dashboard-action-menu'));
    this.dashboardDesigner = new DashboardDesignerModal(this.page);
    this.dashboardTitle = this.page.locator('#dashboard-breadcrumbs .bcrumb-end');
  }

  async goto(dashboardId?: number) {
    const path = dashboardId ? `${this.path}/${dashboardId}` : this.path;
    await this.page.goto(path);
  }

  async openDashboardDesigner() {
    await this.actionMenuButton.click();
    await this.actionMenu.editDashboardLink.click();
    await this.dashboardDesigner.waitFor();
  }
}
