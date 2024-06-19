import { Locator, Page } from '@playwright/test';
import { Report, SavedReport, TempReport } from '../../models/report';

type SchedulingStatus = 'Enabled' | 'Disabled';
type Security = 'Private to me' | 'Private by Role' | 'Public';

export class AddReportDialog {
  private readonly blankReportRadioButton: Locator;
  private readonly copyReportRadioButton: Locator;
  private readonly reportToCopySelector: Locator;
  private readonly tempReportRadioButton: Locator;
  private readonly savedReportRadioButton: Locator;
  private readonly reportNameInput: Locator;
  private readonly schedulingSelector: Locator;
  private readonly securitySelector: Locator;
  private readonly saveButton: Locator;

  constructor(page: Page) {
    this.blankReportRadioButton = page.getByRole('radio', { name: 'A blank report' });
    this.copyReportRadioButton = page.getByRole('radio', { name: 'A copy of' });
    this.reportToCopySelector = page.getByText(/select a report/i);
    this.tempReportRadioButton = page.getByRole('radio', { name: 'Add as a temporary report (can be saved later)' });
    this.savedReportRadioButton = page.getByRole('radio', { name: 'Create as a saved report' });
    this.reportNameInput = page.getByPlaceholder('Report Name', { exact: true });
    this.schedulingSelector = page.locator('.label:has-text("Scheduling") + .data').getByRole('listbox');
    this.securitySelector = page.locator('.label:has-text("Security") + .data').getByRole('listbox');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  private async selectScheduling(scheduling: SchedulingStatus) {
    await this.schedulingSelector.click();
    await this.schedulingSelector.page().getByRole('option', { name: scheduling }).click();
  }

  private async selectReportToCopy(reportToCopy: string) {
    await this.reportToCopySelector.click();
    await this.reportToCopySelector.page().getByText(reportToCopy).click();
  }

  private async selectSecurity(security: Security) {
    await this.securitySelector.click();
    await this.securitySelector.page().getByRole('option', { name: security }).click();
  }

  async addReport(report: Report) {
    await this.blankReportRadioButton.click();

    if (report instanceof TempReport) {
      await this.tempReportRadioButton.click();
    }

    if (report instanceof SavedReport) {
      await this.savedReportRadioButton.click();
      await this.reportNameInput.fill(report.name);
      await this.selectSecurity(report.security);
    }

    await this.saveButton.click();
  }

  async addReportCopy(reportToCopy: string, report: Report) {
    await this.copyReportRadioButton.click();
    await this.selectReportToCopy(reportToCopy);

    if (report instanceof TempReport) {
      await this.tempReportRadioButton.click();
    }

    if (report instanceof SavedReport) {
      await this.savedReportRadioButton.click();
      await this.reportNameInput.fill(report.name);
      await this.selectScheduling(report.scheduling);
      await this.selectSecurity(report.security);
    }

    await this.saveButton.click();
  }
}
