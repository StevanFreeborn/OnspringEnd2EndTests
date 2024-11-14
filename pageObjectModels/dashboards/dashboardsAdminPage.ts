import { Locator, Page } from '@playwright/test';
import { DeleteDashboardDialog } from '../../componentObjectModels/dialogs/deleteDashboardDialog';
import { TEST_DASHBOARD_NAME } from '../../factories/fakeDataFactory';
import { BaseAdminPage } from '../baseAdminPage';

export class DashboardsAdminPage extends BaseAdminPage {
  readonly path: string;
  readonly grid: Locator;
  private readonly deletePathRegex: RegExp;
  readonly deleteDialog: DeleteDashboardDialog;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Dashboard';
    this.grid = this.page.locator('#grid');
    this.deletePathRegex = /\/Admin\/Dashboard\/\d+\/Delete/;
    this.deleteDialog = new DeleteDashboardDialog(page);
  }

  async goto() {
    await this.page.goto(this.path);
    await this.page.waitForLoadState('networkidle');
  }

  private async scrollAllIntoView() {
    const scrollableElement = this.grid.locator('.k-grid-content.k-auto-scrollable').first();

    const pager = this.grid.locator('.k-pager-info').first();
    const pagerText = await pager.innerText();
    const totalNumOfItems = parseInt(pagerText.trim().split(' ')[0]);

    if (Number.isNaN(totalNumOfItems) === false) {
      const itemRows = this.grid.getByRole('row');
      let itemRowsCount = await itemRows.count();

      while (itemRowsCount < totalNumOfItems) {
        await scrollableElement.evaluate(el => (el.scrollTop = el.scrollHeight));
        await this.page.waitForLoadState('networkidle');
        itemRowsCount = await itemRows.count();
      }
    }
  }

  private async delete(row: Locator) {
    await row.hover();
    await row.getByTitle('Delete Dashboard').click();

    const deleteResponse = this.page.waitForResponse(this.deletePathRegex);
    await this.deleteDialog.deleteButton.click();
    await deleteResponse;
    await this.deleteDialog.waitForDialogToBeDismissed();
  }

  async deleteDashboards(dashboardsToDelete: string[]) {
    await this.goto();

    await this.scrollAllIntoView();

    for (const dashboard of dashboardsToDelete) {
      const deleteConnectorRow = this.grid.getByRole('row', { name: new RegExp(dashboard, 'i') });
      await this.delete(deleteConnectorRow);
    }
  }

  async deleteAllTestDashboards() {
    await this.goto();
    await this.scrollAllIntoView();

    const deleteConnectorRow = this.grid.getByRole('row', { name: new RegExp(TEST_DASHBOARD_NAME, 'i') }).last();

    let isVisible = await deleteConnectorRow.isVisible();

    while (isVisible) {
      await this.delete(deleteConnectorRow);
      isVisible = await deleteConnectorRow.isVisible();
    }
  }
}
