import { Locator, Page } from '@playwright/test';
import { DualPaneSelector } from '../../componentObjectModels/controls/dualPaneSelector';
import { BulkDeleteDialog } from '../../componentObjectModels/dialogs/bulkDeleteDialog';
import { DeleteReportDialog } from '../../componentObjectModels/dialogs/deleteReportDialog';
import { ExportUnderwayDialog } from '../../componentObjectModels/dialogs/reportExportUnderwayDialog';
import { FieldType } from '../../componentObjectModels/menus/addFieldTypeMenu';
import { BulkEditModal } from '../../componentObjectModels/modals/bulkEditModal';
import { ExportReportModal } from '../../componentObjectModels/modals/exportReportModal';
import { ReportDesignerModal } from '../../componentObjectModels/modals/reportDesignerModal';
import { Report } from '../../models/report';
import { BasePage } from '../basePage';

export class ReportPage extends BasePage {
  private readonly reportContents: Locator;
  private readonly actionMenuButton: Locator;
  private readonly actionMenu: Locator;
  private readonly editReportButton: Locator;
  private readonly deleteReportDialog: DeleteReportDialog;
  private readonly recordListPathRegex: RegExp;
  private readonly filterInput: Locator;
  private readonly exportReportModal: ExportReportModal;
  private readonly exportUnderwayDialog: ExportUnderwayDialog;
  readonly pathRegex: RegExp;
  readonly breadcrumb: Locator;
  readonly dataGridContainer: Locator;
  readonly selectAllCheckbox: Locator;
  readonly bulkActionButton: Locator;
  readonly bulkActionMenu: Locator;
  readonly reportDesigner: ReportDesignerModal;
  readonly bulkEditModal: BulkEditModal;
  readonly bulkDeleteDialog: BulkDeleteDialog;
  readonly liveFilterMenu: Locator;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Report\/\d+\/Display/;
    this.recordListPathRegex = /\/Report\/\d+\/RecordList/;
    this.breadcrumb = this.page.locator('.bcrumb-container');
    this.reportContents = this.page.locator('#report-contents');
    this.dataGridContainer = this.reportContents.locator('#grid');
    this.selectAllCheckbox = this.dataGridContainer.locator('[data-select-all]');
    this.bulkActionButton = this.dataGridContainer.locator('[data-bulk-menu-button]');
    this.bulkActionMenu = this.dataGridContainer.locator('.popover-menu');
    this.actionMenuButton = this.page.locator('#action-menu-button');
    this.actionMenu = this.page.locator('#action-menu');
    this.editReportButton = this.page.getByRole('link', { name: 'Edit Report' });
    this.reportDesigner = new ReportDesignerModal(this.page);
    this.deleteReportDialog = new DeleteReportDialog(this.page);
    this.bulkEditModal = new BulkEditModal(this.page);
    this.bulkDeleteDialog = new BulkDeleteDialog(this.page);
    this.liveFilterMenu = this.page.locator('.k-filter-menu');
    this.filterInput = this.page.getByPlaceholder('Filter');
    this.exportReportModal = new ExportReportModal(this.page);
    this.exportUnderwayDialog = new ExportUnderwayDialog(this.page);
  }

  async goto(reportId: number) {
    await this.page.goto(`/Report/${reportId}/Display`, { waitUntil: 'networkidle' });
  }

  getReportIdFromUrl() {
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

  async getAllFieldCells(fieldName: string) {
    const headers = await this.dataGridContainer.locator('thead').locator('th').all();
    let fieldIndex = -1;

    for (const [index, header] of headers.entries()) {
      const headerText = await header.textContent();

      if (headerText === fieldName) {
        fieldIndex = index;
      }
    }

    if (fieldIndex === -1) {
      throw new Error(`The field "${fieldName}" was not found in the report.`);
    }

    const rows = await this.dataGridContainer.locator('tbody').locator('tr').all();
    const cells: Locator[] = [];

    for (const row of rows) {
      const cell = row.locator('td').nth(fieldIndex);
      cells.push(cell);
    }

    return cells;
  }

  async applyLiveFilter({
    fieldName,
    fieldType,
    operator,
    value,
  }: {
    fieldName: string;
    fieldType: FieldType;
    operator: string;
    value: string;
  }) {
    const headerCell = this.dataGridContainer.locator('thead').locator('th', { hasText: fieldName });

    const liveFilterButton = headerCell.getByTitle('Filter');
    await liveFilterButton.click();
    await this.liveFilterMenu.waitFor();

    switch (fieldType) {
      case 'List': {
        await this.liveFilterMenu.locator('.k-dropdown.rule-operator').click();
        await this.page.getByRole('option', { name: operator }).click();

        const selector = this.liveFilterMenu.locator('.list.selector-container .onx-selector');

        const valueSelector = new DualPaneSelector(selector);
        await valueSelector.selectOption(value);
        break;
      }
      default:
        throw new Error(`Field type "${fieldType}" is not supported.`);
    }

    const recordListResponse = this.page.waitForResponse(this.recordListPathRegex);
    await this.liveFilterMenu.getByText('Apply').click();
    await recordListResponse;
  }

  async sortByField({ fieldName, sortOrder }: { fieldName: string; sortOrder: 'asc' | 'desc' }) {
    const headerCell = this.dataGridContainer.locator('thead').locator('th', { hasText: fieldName });
    const dataDir = async () => await headerCell.getAttribute('data-dir');

    while ((await dataDir()) !== sortOrder) {
      const getRecordListResponse = this.page.waitForResponse(this.recordListPathRegex);
      await headerCell.click();
      await getRecordListResponse;
    }
  }

  async filterByText(text: string) {
    const getRecordListResponse = this.page.waitForResponse(this.recordListPathRegex);
    await this.filterInput.pressSequentially(text, { delay: 150 });
    await getRecordListResponse;
  }

  async exportReport() {
    await this.actionMenuButton.click();
    await this.actionMenu.getByText('Export Report').click();

    await this.exportReportModal.exportButton.click();

    await this.exportUnderwayDialog.waitFor();
    await this.exportUnderwayDialog.close();
  }
}
