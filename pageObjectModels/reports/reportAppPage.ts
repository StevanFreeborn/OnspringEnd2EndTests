import { Locator, Page } from '@playwright/test';
import { AddReportDialog } from '../../componentObjectModels/dialogs/addReportDialog';
import { ReportDesignerModal } from '../../componentObjectModels/modals/reportDesignerModal';
import { Report } from '../../models/report';
import { BasePage } from '../basePage';

export class ReportAppPage extends BasePage {
  readonly pathRegex: RegExp;
  private readonly createReportButton: Locator;
  private readonly addReportDialog: AddReportDialog;
  readonly reportDesigner: ReportDesignerModal;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Report\/App\/\d+/;
    this.createReportButton = page.getByRole('button', { name: 'Create Report' });
    this.addReportDialog = new AddReportDialog(page);
    this.reportDesigner = new ReportDesignerModal(page);
  }

  async goto(appId: number) {
    await this.page.goto(`/Report/App/${appId}`, { waitUntil: 'networkidle' });
  }

  async createReport(report: Report) {
    await this.createReportButton.click();
    await this.addReportDialog.addReport(report);
  }

  async createCopyOfReport(reportToCopy: string, report: Report) {
    await this.createReportButton.click();
    await this.addReportDialog.addReportCopy(reportToCopy, report);
  }
}
