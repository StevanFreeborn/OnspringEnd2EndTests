import { FrameLocator, Locator } from '@playwright/test';
import { SavedReport } from '../../models/report';

export class ReportGeneralTab {
  private readonly nameInput: Locator;
  private readonly descriptionEditor: Locator;

  constructor(frame: FrameLocator) {
    this.nameInput = frame.getByLabel('Report Name');
    this.descriptionEditor = frame.locator('.content-area.mce-content-body');
  }

  async fillOutForm(report: SavedReport) {
    await this.nameInput.fill(report.name);
    await this.descriptionEditor.fill(report.description);

    // TODO: Implement filling out scheduling
  }
}
