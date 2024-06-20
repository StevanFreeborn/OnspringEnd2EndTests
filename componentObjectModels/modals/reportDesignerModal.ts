import { FrameLocator, Locator, Page } from '@playwright/test';
import { SavedReport } from '../../models/report';
import { ReportGeneralTab } from '../tabs/reportGeneralTab';

type WaitForOptions = Parameters<Locator['waitFor']>[0];

export class ReportDesignerModal {
  private readonly modal: Locator;
  private readonly saveAndRunButton: Locator;
  private readonly frame: FrameLocator;
  private readonly generalTabButton: Locator;
  private readonly generalTab: ReportGeneralTab;

  constructor(page: Page) {
    this.modal = page.getByRole('dialog', { name: /report designer/i });
    this.saveAndRunButton = this.modal.getByRole('button', { name: 'Save Changes & Run' });
    this.frame = this.modal.frameLocator('iframe');
    this.generalTabButton = this.frame.getByRole('tab', { name: 'General' });
    this.generalTab = new ReportGeneralTab(this.frame);
  }

  async waitFor(options?: WaitForOptions) {
    await this.modal.waitFor(options);
  }

  async saveChangesAndRun() {
    await this.saveAndRunButton.click();
  }

  async updateSavedReport(report: SavedReport) {
    await this.generalTabButton.click();
    await this.generalTab.fillOutForm(report);
  }
}
