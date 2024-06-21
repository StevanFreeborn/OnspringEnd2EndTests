import { Locator, Page } from '@playwright/test';
import { BulkDeleteDialog } from '../../componentObjectModels/dialogs/bulkDeleteDialog';
import { DeleteReportDialog } from '../../componentObjectModels/dialogs/deleteReportDialog';
import { BulkEditModal } from '../../componentObjectModels/modals/bulkEditModal';
import { ReportDesignerModal } from '../../componentObjectModels/modals/reportDesignerModal';
import { LayoutItem } from '../../models/layoutItem';
import { Report } from '../../models/report';
import { BasePage } from '../basePage';

export class ReportPage extends BasePage {
  private readonly reportContents: Locator;
  private readonly actionMenuButton: Locator;
  private readonly actionMenu: Locator;
  private readonly editReportButton: Locator;
  private readonly deleteReportDialog: DeleteReportDialog;
  readonly pathRegex: RegExp;
  readonly breadcrumb: Locator;
  readonly dataGridContainer: Locator;
  readonly selectAllCheckbox: Locator;
  readonly bulkActionButton: Locator;
  readonly bulkActionMenu: Locator;
  readonly reportDesigner: ReportDesignerModal;
  readonly bulkEditModal: BulkEditModal;
  readonly bulkDeleteDialog: BulkDeleteDialog;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Report\/\d+\/Display/;
    this.breadcrumb = page.locator('.bcrumb-container');
    this.reportContents = page.locator('#report-contents');
    this.dataGridContainer = this.reportContents.locator('#grid');
    this.selectAllCheckbox = this.dataGridContainer.locator('[data-select-all]');
    this.bulkActionButton = this.dataGridContainer.locator('[data-bulk-menu-button]');
    this.bulkActionMenu = this.dataGridContainer.locator('.popover-menu');
    this.actionMenuButton = page.locator('#action-menu-button');
    this.actionMenu = page.locator('#action-menu');
    this.editReportButton = page.getByRole('link', { name: 'Edit Report' });
    this.reportDesigner = new ReportDesignerModal(page);
    this.deleteReportDialog = new DeleteReportDialog(page);
    this.bulkEditModal = new BulkEditModal(page);
    this.bulkDeleteDialog = new BulkDeleteDialog(page);
  }

  async goto(reportId: number) {
    await this.page.goto(`/Report/${reportId}/Display`, { waitUntil: 'networkidle' });
  }

  async getReportIdFromUrl() {
    if (this.page.url().match(this.pathRegex) === null) {
      throw new Error('The current page is not a report display page.');
    }

    const url = this.page.url();
    const urlParts = url.split('/');
    const reportId = urlParts[urlParts.length - 2];
    return parseInt(reportId);
  }

  async updateReport(report: Report) {
    await this.editReportButton.click();
    await this.reportDesigner.waitFor();
    await this.reportDesigner.updateReport(report);
    await this.reportDesigner.saveChangesAndRun();
  }

  async deleteReport() {
    await this.actionMenuButton.click();
    await this.actionMenu.getByText('Delete Report').click();
    await this.deleteReportDialog.deleteButton.click();
    await this.deleteReportDialog.waitForDialogToBeDismissed();
  }

  async selectAllRecords() {
    await this.selectAllCheckbox.click();
  }

  async bulkEditSelectedRecords() {
    await this.bulkActionButton.click();
    await this.bulkActionMenu.waitFor();
    await this.bulkActionMenu.getByText('Edit Selected Records').click();
  }

  async bulkDeleteSelectedRecords() {
    await this.bulkActionButton.click();
    await this.bulkActionMenu.waitFor();
    await this.bulkActionMenu.getByText('Delete Selected Records').click();
  }

  async getAllFieldCells(field: LayoutItem) {
    const headers = await this.dataGridContainer.locator('thead').locator('th').all();
    let fieldIndex = -1;

    for (const [index, header] of headers.entries()) {
      const headerText = await header.textContent();

      if (headerText === field.name) {
        fieldIndex = index;
      }
    }

    if (fieldIndex === -1) {
      throw new Error(`The field "${field.name}" was not found in the report.`);
    }

    const rows = await this.dataGridContainer.locator('tbody').locator('tr').all();
    const cells: Locator[] = [];

    for (const row of rows) {
      const cell = row.locator('td').nth(fieldIndex);
      cells.push(cell);
    }

    return cells;
  }
}
