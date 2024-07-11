import { FrameLocator, Locator } from '@playwright/test';
import { Report, SavedReportAsReportDataOnly } from '../../models/report';

export class ReportVisualTab {
  private readonly frame: FrameLocator;
  private readonly displayTypeSelector: Locator;
  private readonly bulkEditCheckbox: Locator;
  private readonly bulkDeleteCheckbox: Locator;

  constructor(frame: FrameLocator) {
    this.frame = frame;
    this.displayTypeSelector = frame.locator('.label:has-text("Display Type") + .data').getByRole('listbox');
    this.bulkEditCheckbox = frame.getByLabel('Allow bulk edit');
    this.bulkDeleteCheckbox = frame.getByLabel('Allow bulk delete');
  }

  private async selectDisplayType(displayType: string) {
    await this.displayTypeSelector.click();
    await this.frame.getByRole('option', { name: displayType }).click();
  }

  async fillOutForm(report: Report) {
    await this.selectDisplayType(report.displayType);

    if (report instanceof SavedReportAsReportDataOnly) {
      await this.bulkEditCheckbox.setChecked(report.bulkEdit);
      await this.bulkDeleteCheckbox.setChecked(report.bulkDelete);
    }
  }
}
