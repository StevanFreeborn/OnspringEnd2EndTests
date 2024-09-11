import { FrameLocator, Locator } from '@playwright/test';
import {
  AdvancedChart,
  BubbleChart,
  ChartDisplayOption,
  ColorStop,
  ColumnPlusLineChart,
  HeatMapChart,
  LineChart,
  SplineChart,
  StackedColumnPlusLineChart,
} from '../../models/chart';
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
  private readonly lineChartConfiguration: Locator;
  private readonly colorStopsGrid: ColorStopsGrid;

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
    this.lineChartConfiguration = this.frame.locator('.label:has-text("Line Chart Configuration") + .data');
    this.colorStopsGrid = new ColorStopsGrid(this.frame.locator('#ColorStops'), this.frame);
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

        if (report.chart instanceof BubbleChart) {
          await this.chartDataRuleControl.selectGroupData(report.chart.additionalGroupData);
        }
      } else {
        await this.selectGroupData(report.chart.groupData);
        await this.selectSummaryData(report.chart.summaryData);
      }

      if (report.chart instanceof ColumnPlusLineChart || report.chart instanceof StackedColumnPlusLineChart) {
        const sourceSelector = this.lineChartConfiguration.getByRole('listbox').first();
        const appSelector = this.lineChartConfiguration.getByRole('listbox').nth(1);
        const existingChartSelector = this.lineChartConfiguration
          .locator('[data-existing-subreport]')
          .getByRole('listbox');

        if (report.chart.lineChart instanceof SavedReportAsChart) {
          const isLineChart =
            report.chart.lineChart.chart instanceof LineChart || report.chart.lineChart.chart instanceof SplineChart;

          if (isLineChart === false) {
            throw new Error("Saved report's chart must be a line or spline chart");
          }

          await sourceSelector.click();
          await this.frame.getByRole('option', { name: 'Use an existing chart report' }).click();

          await appSelector.click();
          await this.frame.getByRole('option', { name: report.chart.lineChart.appName }).click();

          await existingChartSelector.click();
          await this.frame.getByRole('option', { name: report.chart.lineChart.name }).click();
        } else {
          throw new Error('Using line chart is not implemented');
        }
      }

      if (report.chart instanceof HeatMapChart) {
        await this.colorStopsGrid.addColorStops(report.chart.colorStops);
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

export class ColorStopsGrid {
  private readonly frame: FrameLocator;
  private readonly control: Locator;
  private readonly addValueButton: Locator;
  private readonly gridBody: Locator;

  constructor(control: Locator, frame: FrameLocator) {
    this.frame = frame;
    this.control = control;
    this.addValueButton = this.control.getByRole('button', { name: 'Add Value' });
    this.gridBody = this.control.locator('.k-grid-content');
  }

  async addColorStops(colorStops: ColorStop[]) {
    for (const [index, colorStop] of colorStops.entries()) {
      const row = this.gridBody.getByRole('row').nth(index);

      await this.addValueButton.click();
      await row.waitFor();

      const valueInput = row.locator('td[data-field="value"] input:visible');

      await valueInput.focus();
      await valueInput.fill(colorStop.value.toString());

      const colorPicker = row.locator('td[data-field="color"] .k-colorpicker');
      const colorPickerModal = this.frame.locator('div:visible[data-role="colorpicker"]');

      await colorPicker.click();

      // TODO: ...😠...
      // Without taking a short pause here the input to the
      // colorpicker is not entered correctly
      // eslint-disable-next-line playwright/no-wait-for-timeout
      await this.control.page().waitForTimeout(1000);

      const colorInput = colorPickerModal.getByPlaceholder('no color');

      await colorInput.clear();
      await colorInput.pressSequentially(colorStop.color, { delay: 150 });

      await colorPicker.click();
    }
  }
}
