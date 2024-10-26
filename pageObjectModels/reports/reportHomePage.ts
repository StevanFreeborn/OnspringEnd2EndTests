import { Locator, Page } from '@playwright/test';
import { AddReportDialog } from '../../componentObjectModels/dialogs/addReportDialog';
import { ReportDesignerModal } from '../../componentObjectModels/modals/reportDesignerModal';
import { Report } from '../../models/report';
import { BasePage } from '../basePage';

export class ReportHomePage extends BasePage {
  readonly pathRegex: RegExp;
  private readonly createReportButton: Locator;
  private readonly createMenu: Locator;
  private readonly addReportDialog: AddReportDialog;
  readonly reportDesigner: ReportDesignerModal;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Report/;
    this.createReportButton = page.getByRole('button', { name: 'Create Report' });
    this.createMenu = page.locator('#create-menu');
    this.addReportDialog = new AddReportDialog(page);
    this.reportDesigner = new ReportDesignerModal(page);
  }

  async goto() {
    await this.page.goto('/Report', { waitUntil: 'networkidle' });
  }

  async createReport(report: Report) {
    await this.createReportButton.click();
    await this.createMenu.getByText(report.appName, { exact: true }).click();
    await this.addReportDialog.addReport(report);
    await this.reportDesigner.waitFor();
    await this.reportDesigner.updateReport(report);
    await this.reportDesigner.saveChangesAndRun();
  }

  async createCopyOfReport(reportToCopy: string, report: Report) {
    await this.createReportButton.click();
    await this.createMenu.getByText(report.appName, { exact: true }).click();
    await this.addReportDialog.addReportCopy(reportToCopy, report);
    await this.reportDesigner.waitFor();
    await this.reportDesigner.updateReport(report);
    await this.reportDesigner.saveChangesAndRun();
  }
}
