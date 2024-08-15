import { FrameLocator, Locator } from '@playwright/test';
import { AdvancedChart, ChartDisplayOption } from '../../models/chart';
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
  private readonly chartDataRuleControl: ChartDataRuleControl;
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
    this.chartDataRuleControl = new ChartDataRuleControl(frame);
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
    await this.frame.getByRole('option', { name: chartType }).first().click();
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

      if (report.chart instanceof AdvancedChart) {
        await this.chartDataRuleControl.clearRules();
        await this.chartDataRuleControl.selectGroupData(report.chart.groupData);
        await this.chartDataRuleControl.selectSummaryData(report.chart.summaryData);
        await this.chartDataRuleControl.selectSeriesData(report.chart.seriesData);
      } else {
        await this.selectGroupData(report.chart.groupData);
        await this.selectSummaryData(report.chart.summaryData);
      }

      await this.selectVisibility(report.chart.visibility);
      await this.selectDisplayOptions(report.chart.displayOptions);
    }
  }
}

export class ChartDataRuleControl {
  private readonly frame: FrameLocator;
  private readonly control: Locator;
  private readonly dataSelector: Locator;
  private readonly groupDataSelector: Locator;
  private readonly summaryDataSelector: TreeviewSelector;
  private readonly seriesDataSelector: TreeviewSelector;
  private readonly addButton: Locator;
  private readonly ruleList: Locator;

  constructor(frame: FrameLocator) {
    this.frame = frame;
    this.control = this.frame.locator('.label:has-text("Chart Data") + .data');
    this.dataSelector = this.control.getByRole('listbox').first();
    this.groupDataSelector = this.control.locator('#Groupings').getByRole('listbox');
    this.summaryDataSelector = new TreeviewSelector(
      this.control.locator('[data-advanced-aggregate-container]'),
      this.frame
    );
    this.seriesDataSelector = new TreeviewSelector(this.control.locator('#Series'), this.frame);
    this.addButton = this.control.getByRole('button', { name: 'Add' });
    this.ruleList = this.frame.locator('#Aggregates').locator('.rule-list');
  }

  async selectGroupData(groupData: string) {
    await this.dataSelector.click();
    await this.frame.getByRole('option', { name: 'Group Data' }).click();

    await this.groupDataSelector.click();
    await this.frame.getByRole('option', { name: groupData }).click();

    await this.addButton.click();
  }

  async selectSummaryData(summaryData: string) {
    await this.dataSelector.click();
    await this.frame.getByRole('option', { name: 'Summary Data' }).click();

    await this.summaryDataSelector.selectOption(summaryData);

    await this.addButton.click();
  }

  async selectSeriesData(seriesData: string) {
    await this.dataSelector.click();
    await this.frame.getByRole('option', { name: 'Series Data' }).click();

    await this.seriesDataSelector.selectOption(seriesData);

    await this.addButton.click();
  }

  async clearRules() {
    const rules = await this.ruleList.locator('[data-index]').all();

    for (const rule of rules) {
      await rule.getByTitle('Delete').click();
    }
  }
}
