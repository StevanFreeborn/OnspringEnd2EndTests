import { Locator, Page } from '@playwright/test';
import { ReportDesignerModal } from '../../componentObjectModels/modals/reportDesignerModal';
import { Report, SavedReport } from '../../models/report';
import { BasePage } from '../basePage';

export class ReportPage extends BasePage {
  private readonly reportContents: Locator;
  private readonly actionMenuButton: Locator;
  private readonly actionMenu: Locator;
  private readonly editReportButton: Locator;
  readonly pathRegex: RegExp;
  readonly breadcrumb: Locator;
  readonly dataGridContainer: Locator;
  readonly reportDesigner: ReportDesignerModal;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Report\/\d+\/Display/;
    this.breadcrumb = page.locator('.bcrumb-container');
    this.reportContents = page.locator('#report-contents');
    this.dataGridContainer = this.reportContents.locator('#grid');
    this.actionMenuButton = this.reportContents.locator('#action-menu-button');
    this.actionMenu = page.locator('#action-menu');
    this.editReportButton = page.getByRole('link', { name: 'Edit Report' });
    this.reportDesigner = new ReportDesignerModal(page);
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

    if (report instanceof SavedReport) {
      await this.reportDesigner.updateSavedReport(report);
      await this.reportDesigner.saveChangesAndRun();
    }
  }
}
