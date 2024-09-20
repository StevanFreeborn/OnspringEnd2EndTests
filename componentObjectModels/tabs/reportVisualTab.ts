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
import {
  CalendarValue,
  GanttChartValue,
  Report,
  SavedReportAsCalendar,
  SavedReportAsChart,
  SavedReportAsGanttChart,
  SavedReportAsReportDataOnly,
} from '../../models/report';
import { DualPaneSelector } from '../controls/dualPaneSelector';
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
  private readonly colorBasedOnSelector: Locator;
  private readonly defaultViewSelector: Locator;
  private readonly agendaFieldsSelector: DualPaneSelector;
  private readonly initialDateSelector: Locator;
  private readonly calendarValuesGrid: CalendarValuesGrid;
  private readonly rowHeaderFieldsSelector: DualPaneSelector;
  private readonly timeIncrementsSelector: DualPaneSelector;
  private readonly timeFrameDisplaySelector: Locator;
  private readonly milestoneFieldSelector: Locator;
  private readonly ganttValuesGrid: GanttValuesGrid;

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
    this.colorBasedOnSelector = this.frame.locator('.label:has-text("Color Based On") + .data').getByRole('listbox');
    this.defaultViewSelector = this.frame.locator('.label:has-text("Default View") + .data').getByRole('listbox');
    this.agendaFieldsSelector = new DualPaneSelector(
      this.frame.locator('.label:has-text("Agenda Fields") + .data .onx-selector'),
      this.frame
    );
    this.initialDateSelector = this.frame.locator('.label:has-text("Initial Date") + .data').getByRole('listbox');
    this.calendarValuesGrid = new CalendarValuesGrid(this.frame.locator('#CalendarValues'), this.frame);
    this.rowHeaderFieldsSelector = new DualPaneSelector(
      this.frame.locator('.label:has-text("Row Header Fields") + .data .onx-selector'),
      this.frame
    );
    this.timeIncrementsSelector = new DualPaneSelector(
      this.frame.locator('.label:has-text("Time Increments") + .data .onx-selector'),
      this.frame
    );
    this.timeFrameDisplaySelector = this.frame
      .locator('.label:has-text("Timeframe Display") + .data')
      .getByRole('listbox');
    this.milestoneFieldSelector = this.frame.locator('.label:has-text("Milestone Field") + .data').getByRole('listbox');
    this.ganttValuesGrid = new GanttValuesGrid(this.frame.locator('#GanttValues'), this.frame);
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

  private async selectColorBasedOn(colorBasedOn: string) {
    await this.colorBasedOnSelector.click();
    await this.frame.getByRole('option', { name: colorBasedOn }).click();
  }

  private async selectDefaultView(defaultView: string) {
    await this.defaultViewSelector.click();
    await this.frame.getByRole('option', { name: defaultView }).click();
  }

  private async selectAgendaFields(agendaFields: string[]) {
    await this.agendaFieldsSelector.selectOptions(agendaFields);
  }

  private async selectInitialDate(initialDate: string) {
    await this.initialDateSelector.click();
    await this.frame.getByRole('option', { name: initialDate }).click();
  }

  private async selectRowHeaderFields(rowHeaderFields: string[]) {
    await this.rowHeaderFieldsSelector.selectOptions(rowHeaderFields);
  }

  private async selectTimeIncrements(timeIncrements: string[]) {
    await this.timeIncrementsSelector.selectOptions(timeIncrements);
  }

  private async selectTimeFrameDisplay(timeFrameDisplay: string) {
    await this.timeFrameDisplaySelector.click();
    await this.frame.getByRole('option', { name: timeFrameDisplay }).click();
  }

  private async selectMilestoneField(milestoneField: string) {
    await this.milestoneFieldSelector.click();
    await this.frame.getByRole('option', { name: milestoneField }).click();
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
        await this.colorStopsGrid.addValues(report.chart.colorStops);
      }

      await this.selectVisibility(report.chart.visibility);
      await this.selectDisplayOptions(report.chart.displayOptions);
    }

    if (report instanceof SavedReportAsCalendar) {
      await this.selectColorBasedOn(report.colorBasedOn);
      await this.selectDefaultView(report.defaultView);
      await this.calendarValuesGrid.addValues(report.calendarValues);
      await this.selectAgendaFields(report.agendaFields);
      await this.selectInitialDate(report.initialDate);
    }

    if (report instanceof SavedReportAsGanttChart) {
      if (report.groupData) {
        await this.selectGroupData(report.groupData);
      }

      await this.selectRowHeaderFields(report.rowHeaderFields);
      await this.selectColorBasedOn(report.colorBasedOn);
      await this.ganttValuesGrid.addValues(report.ganttValues);

      if (report.milestoneField) {
        await this.selectMilestoneField(report.milestoneField);
      }

      await this.selectDisplayOptions(report.displayOptions);
      await this.selectTimeIncrements(report.timeIncrements);
      await this.selectTimeFrameDisplay(report.timeFrameDisplay);
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

abstract class ValuesGrid {
  protected readonly frame: FrameLocator;
  protected readonly control: Locator;
  protected readonly addValueButton: Locator;
  protected readonly gridBody: Locator;

  constructor(control: Locator, frame: FrameLocator) {
    this.frame = frame;
    this.control = control;
    this.addValueButton = this.control.getByRole('button', { name: 'Add Value' });
    this.gridBody = this.control.locator('.k-grid-content');
  }

  protected async selectColor(row: Locator, color: string) {
    const colorPicker = row.locator('td[data-field="color"] .k-colorpicker');
    const colorPickerModal = this.frame.locator('div:visible[data-role="colorpicker"]');

    await colorPicker.click();

    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.control.page().waitForTimeout(1000);

    const colorInput = colorPickerModal.getByPlaceholder('no color');

    await colorInput.clear();
    await colorInput.pressSequentially(color, { delay: 150 });

    await colorPicker.click();
  }

  protected async selectValueForField(row: Locator, field: string, value: string) {
    const fieldSelector = row.locator(`td[data-field="${field}"]`).getByRole('listbox');
    await fieldSelector.click();
    await this.frame.getByRole('option', { name: value }).click();
  }

  abstract addValues(values: unknown[]): Promise<void>;
}

class ColorStopsGrid extends ValuesGrid {
  constructor(control: Locator, frame: FrameLocator) {
    super(control, frame);
  }

  async addValues(colorStops: ColorStop[]) {
    for (const [index, colorStop] of colorStops.entries()) {
      const row = this.gridBody.getByRole('row').nth(index);

      await this.addValueButton.click();
      await row.waitFor();

      const valueInput = row.locator('td[data-field="value"] input:visible');

      await valueInput.focus();
      await valueInput.fill(colorStop.value.toString());

      await this.selectColor(row, colorStop.color);
    }
  }
}

class CalendarValuesGrid extends ValuesGrid {
  constructor(control: Locator, frame: FrameLocator) {
    super(control, frame);
  }

  async addValues(values: CalendarValue[]) {
    for (const [index, value] of values.entries()) {
      const row = this.gridBody.getByRole('row').nth(index);

      await this.addValueButton.click();
      await row.waitFor();

      await this.selectValueForField(row, 'startFieldConfigId', value.startDateField);

      if (value.endDateField) {
        await this.selectValueForField(row, 'endFieldConfigId', value.endDateField);
      }

      if (value.color) {
        await this.selectColor(row, value.color);
      }
    }
  }
}

class GanttValuesGrid extends ValuesGrid {
  constructor(control: Locator, frame: FrameLocator) {
    super(control, frame);
  }

  async addValues(values: GanttChartValue[]) {
    for (const [index, value] of values.entries()) {
      await this.addValueButton.click();

      const row = this.gridBody.getByRole('row').nth(index);
      await row.waitFor();

      await this.selectValueForField(row, 'startFieldConfigId', value.startDateField);
      await this.selectValueForField(row, 'endFieldConfigId', value.endDateField);

      if (value.endDateField) {
        await this.selectValueForField(row, 'endFieldConfigId', value.endDateField);
      }

      if (value.percentCompleteField) {
        await this.selectValueForField(row, 'pctCompleteFieldConfigId', value.percentCompleteField);
      }

      if (value.dependencyField) {
        await this.selectValueForField(row, 'dependencyFieldConfigId', value.dependencyField);
      }

      if (value.labelField) {
        await this.selectValueForField(row, 'labelFieldConfigId', value.labelField);
      }

      if (value.legendText) {
        const legendTextInput = row.locator('td[data-field="legendText"] input:visible');
        await legendTextInput.focus();
        await legendTextInput.fill(value.legendText);
      }

      if (value.color) {
        await this.selectColor(row, value.color);
      }
    }
  }
}
