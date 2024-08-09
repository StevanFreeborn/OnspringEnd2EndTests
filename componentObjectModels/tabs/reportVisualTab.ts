import { FrameLocator, Locator } from '@playwright/test';
import { ChartDisplayOption } from '../../models/chart';
import { Report, SavedReportAsChart, SavedReportAsReportDataOnly } from '../../models/report';
import { TreeviewSelector } from '../controls/treeviewSelector';

export class ReportVisualTab {
  private readonly frame: FrameLocator;
  private readonly displayTypeSelector: Locator;
  private readonly bulkEditCheckbox: Locator;
  private readonly bulkDeleteCheckbox: Locator;
  private readonly visibilitySelector: Locator;
  private readonly groupDataSelector: Locator;
  private readonly summaryDataSelector: TreeviewSelector;
  private readonly chartTypeSelector: Locator;
  private readonly chartModeContainer: Locator;
  private readonly displayOptions: Locator;

  constructor(frame: FrameLocator) {
    this.frame = frame;
    this.displayTypeSelector = this.frame.locator('.label:has-text("Display Type") + .data').getByRole('listbox');
    this.bulkEditCheckbox = this.frame.getByLabel('Allow bulk edit');
    this.bulkDeleteCheckbox = this.frame.getByLabel('Allow bulk delete');
    this.visibilitySelector = this.frame.locator('.label:has-text("Visibility") + .data').getByRole('listbox');
    this.groupDataSelector = this.frame.locator('.label:has-text("Group Data") + .data').getByRole('listbox');
    this.summaryDataSelector = new TreeviewSelector(
      this.frame.locator('.label:has-text("Summary Data") + .data .onx-selector'),
      this.frame
    );
    this.chartTypeSelector = this.frame.locator('.label:has-text("Chart Type") + .data').getByRole('listbox');
    this.chartModeContainer = this.frame.locator('.chart-mode');
    this.displayOptions = this.frame.locator('.label:has-text("Display Options") + .data');
  }

  private async selectDisplayType(displayType: string) {
    await this.displayTypeSelector.click();
    await this.frame.getByRole('option', { name: displayType }).click();
  }

  private async selectVisibility(visibility: string) {
    await this.visibilitySelector.click();
    await this.frame.getByRole('option', { name: visibility }).click();
  }

  private async selectGroupData(groupData: string) {
    await this.groupDataSelector.click();
    await this.frame.getByRole('option', { name: groupData }).click();
  }

  private async selectSummaryData(summaryData: string) {
    await this.summaryDataSelector.selectOption(summaryData);
  }

  private async selectMode(mode: string) {
    await this.chartModeContainer.getByRole('radio', { name: mode }).click();
  }

  private async selectChartType(chartType: string) {
    await this.chartTypeSelector.click();
    await this.frame.getByRole('option', { name: chartType }).click();
  }

  private async selectDisplayOptions(displayOptions: ChartDisplayOption[]) {
    for (const option of displayOptions) {
      const checkbox = this.displayOptions.getByRole('checkbox', { name: option.name });
      await checkbox.setChecked(option.status);
    }
  }

  async fillOutForm(report: Report) {
    await this.selectDisplayType(report.displayType);

    if (report instanceof SavedReportAsReportDataOnly && report.relatedData.length === 0) {
      await this.bulkEditCheckbox.setChecked(report.bulkEdit);
      await this.bulkDeleteCheckbox.setChecked(report.bulkDelete);
    }

    if (report instanceof SavedReportAsChart) {
      await this.selectMode(report.chart.mode);
      await this.selectChartType(report.chart.type);

      await this.selectGroupData(report.chart.groupData);
      await this.selectSummaryData(report.chart.summaryData);

      await this.selectVisibility(report.chart.visibility);
      await this.selectDisplayOptions(report.chart.displayOptions);
    }
  }
}
