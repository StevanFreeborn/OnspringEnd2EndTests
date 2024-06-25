import { FrameLocator, Locator } from '@playwright/test';
import { SavedReport } from '../../models/report';

export class ReportGeneralTab {
  private readonly reportNameInput: Locator;

  constructor(frame: FrameLocator) {
    this.reportNameInput = frame.getByLabel('Report Name');
  }

  async fillOutForm(report: SavedReport) {
    await this.reportNameInput.fill(report.name);
  }
}
