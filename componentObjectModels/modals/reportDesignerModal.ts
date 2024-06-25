import { FrameLocator, Locator, Page } from '@playwright/test';
import { Report, SavedReport } from '../../models/report';
import { ReportFieldsTab } from '../tabs/reportFieldsTab';
import { ReportGeneralTab } from '../tabs/reportGeneralTab';
import { ReportVisualTab } from '../tabs/reportVisualTab';

type WaitForOptions = Parameters<Locator['waitFor']>[0];

export class ReportDesignerModal {
  private readonly modal: Locator;
  private readonly saveAndRunButton: Locator;
  private readonly frame: FrameLocator;
  private readonly generalTabButton: Locator;
  private readonly fieldsTabButton: Locator;
  private readonly visualTabButton: Locator;
  private readonly generalTab: ReportGeneralTab;
  private readonly fieldsTab: ReportFieldsTab;
  private readonly visualTab: ReportVisualTab;

  constructor(page: Page) {
    this.modal = page.getByRole('dialog', { name: /report designer/i });
    this.saveAndRunButton = this.modal.getByRole('button', { name: 'Save Changes & Run' });
    this.frame = this.modal.frameLocator('iframe');
    this.generalTabButton = this.frame.getByRole('tab', { name: 'General' });
    this.fieldsTabButton = this.frame.getByRole('tab', { name: 'Fields' });
    this.visualTabButton = this.frame.getByRole('tab', { name: 'Visual' });
    this.generalTab = new ReportGeneralTab(this.frame);
    this.fieldsTab = new ReportFieldsTab(this.frame);
    this.visualTab = new ReportVisualTab(this.frame);
  }

  async waitFor(options?: WaitForOptions) {
    await this.modal.waitFor(options);
  }

  async saveChangesAndRun() {
    await this.saveAndRunButton.click();
  }

  async updateReport(report: Report) {
    if (report instanceof SavedReport) {
      await this.generalTabButton.click();
      await this.generalTab.fillOutForm(report);
    }

    await this.fieldsTabButton.click();
    await this.fieldsTab.fillOutForm(report);

    await this.visualTabButton.click();
    await this.visualTab.fillOutForm(report);
  }
}
