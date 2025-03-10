import { Locator, Page } from '@playwright/test';
import { AddReportDialog } from '../../componentObjectModels/dialogs/addReportDialog';
import { ReportDesignerModal } from '../../componentObjectModels/modals/reportDesignerModal';
import { Report } from '../../models/report';
import { BasePage } from '../basePage';

export class ReportAppPage extends BasePage {
  private readonly getReportsPathRegex: RegExp;
  readonly pathRegex: RegExp;
  private readonly createReportButton: Locator;
  private readonly addReportDialog: AddReportDialog;
  readonly reportDesigner: ReportDesignerModal;
  readonly allReportsGrid: Locator;

  constructor(page: Page) {
    super(page);
    this.getReportsPathRegex = /\/Report\/ReportList\/\d+/;
    this.pathRegex = /\/Report\/App\/\d+/;
    this.createReportButton = page.getByRole('button', { name: 'Create Report' });
    this.addReportDialog = new AddReportDialog(page);
    this.reportDesigner = new ReportDesignerModal(page);
    this.allReportsGrid = page.locator('#grid-0');
  }

  async goto(appId: number) {
    const getReportsResponse = this.page.waitForResponse(this.getReportsPathRegex);
    await this.page.goto(`/Report/App/${appId}`);
    await getReportsResponse;
  }

  async createReport(report: Report) {
    await this.createReportButton.click();
    await this.addReportDialog.addReport(report);
    await this.reportDesigner.waitFor();
    await this.reportDesigner.updateReport(report);
    await this.reportDesigner.saveChangesAndRun();
  }

  async createCopyOfReport(reportToCopy: string, report: Report) {
    await this.createReportButton.click();
    await this.addReportDialog.addReportCopy(reportToCopy, report);
    await this.reportDesigner.waitFor();
    await this.reportDesigner.updateReport(report);
    await this.reportDesigner.saveChangesAndRun();
  }
}
