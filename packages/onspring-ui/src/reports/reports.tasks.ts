import { Response } from '@playwright/test';
import {
  AdvancedChart,
  BubbleChart,
  ColumnPlusLineChart,
  DisplayField,
  FieldType,
  HeatMapChart,
  LayoutItem,
  LineChart,
  ListField,
  Report,
  SavedReport,
  SavedReportAsCalendar,
  SavedReportAsChart,
  SavedReportAsGanttChart,
  SavedReportAsPointMap,
  SavedReportAsReportDataOnly,
  SplineChart,
  StackedColumnPlusLineChart,
  TempReport,
} from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { ColorPickerControlTasks } from '../common/controls/colorPickerControl.js';
import { DateFieldControlTasks } from '../common/controls/dateFieldControl.js';
import { DatePickerTasks } from '../common/controls/datePicker.js';
import { DualPaneSelector } from '../common/controls/dualPaneSelector.js';
import { EmailAddressControlTasks } from '../common/controls/emailAddressControl.js';
import { StatusSwitchTasks } from '../common/controls/statusSwitch.js';
import { TreeviewSelectorTasks } from '../common/controls/treeviewSelector.js';
import { DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import {
  AddReportDialogTargets,
  ReportAppPageTargets,
  ReportDesignerTargets,
  ReportHomePageTargets,
  ReportPageTargets,
} from './reports.targets.js';

type ReportDisplayConfigBody = {
  chartConfig: {
    chartConfigData: {
      dataset: { seriesName: string }[];
    };
  };
};

async function fillAddReportDialog(actor: WebActor, report: Report, reportToCopy?: string): Promise<void> {
  if (reportToCopy !== undefined) {
    await actor.browse().click(AddReportDialogTargets.copyReportRadioButton);
    await actor.browse().click(AddReportDialogTargets.reportToCopySelector);
    await actor.browse().click(AddReportDialogTargets.optionByName(reportToCopy));
  } else {
    await actor.browse().click(AddReportDialogTargets.blankReportRadioButton);
  }

  if (report instanceof TempReport) {
    await actor.browse().click(AddReportDialogTargets.tempReportRadioButton);
  }

  if (report instanceof SavedReport) {
    await actor.browse().click(AddReportDialogTargets.savedReportRadioButton);
    await actor.browse().fill(AddReportDialogTargets.reportNameInput, report.name);

    if (reportToCopy !== undefined && (await actor.browse().isVisible(AddReportDialogTargets.schedulingSelector))) {
      await actor.browse().click(AddReportDialogTargets.schedulingSelector);
      await actor.browse().click(AddReportDialogTargets.optionByName(report.scheduling));
    }

    await actor.browse().click(AddReportDialogTargets.securitySelector);
    await actor.browse().click(AddReportDialogTargets.optionByName(report.security));
  }

  await actor.browse().click(AddReportDialogTargets.saveButton);
}

async function fillGeneralTab(actor: WebActor, report: SavedReport): Promise<void> {
  const gen = ReportDesignerTargets.generalTab;
  const frame = ReportDesignerTargets.frame;

  await actor.browse().click(ReportDesignerTargets.generalTabButton);
  await actor.browse().fill(gen.nameInput, report.name);
  await actor.browse().fill(gen.descriptionEditor, report.description);

  await actor.attemptsTo(
    StatusSwitchTasks.setAriaSwitch({
      switchTarget: gen.scheduleStatusSwitch,
      toggleTarget: gen.scheduleStatusToggle,
      enabled: report.scheduling === 'Enabled',
    })
  );

  if (report.scheduling === 'Enabled' && report.schedule !== undefined) {
    const schedule = report.schedule;

    await actor.browse().click(gen.sendFrequencySelector);
    await actor.browse().click(ReportDesignerTargets.optionByName(schedule.sendFrequency));

    await actor.attemptsTo(DateFieldControlTasks.enterDate(gen.startingOnDateControl, schedule.startingOn));

    if (schedule.endingOn !== undefined) {
      await actor.attemptsTo(DateFieldControlTasks.enterDate(gen.endingOnDateControl, schedule.endingOn));
    }

    await actor.browse().click(gen.sendAsSelector);
    await actor.browse().click(ReportDesignerTargets.optionByName(schedule.sendAs));

    await actor.browse().click(gen.typeSelector);
    await actor.browse().click(ReportDesignerTargets.optionByName(schedule.type));

    await actor.browse().click(gen.dataSelector);
    await actor.browse().click(ReportDesignerTargets.optionByName(schedule.data));

    await actor.browse().setChecked(gen.doNotSendIfEmptyCheckbox, schedule.doNotSendIfEmpty);

    await actor.browse().click(gen.dataFormatSelector);
    await actor.browse().click(ReportDesignerTargets.optionByName(schedule.dataFormat));

    await actor.browse().click(gen.numberDateFormatSelector);
    await actor.browse().click(ReportDesignerTargets.optionByName(schedule.numberDateFormat));

    await actor.browse().setChecked(gen.includeAllLevelsCheckbox, schedule.includeAllLevels);

    if (report.security !== 'Private') {
      await actor.attemptsTo(
        DualPaneSelector.selectOptions(gen.specificGroupsSelector, schedule.specificGroups, frame),
        DualPaneSelector.selectOptions(gen.specificUsersSelector, schedule.specificUsers, frame)
      );
    }

    await actor.browse().fill(gen.fromNameInput, schedule.fromName);
    await actor.attemptsTo(
      EmailAddressControlTasks.enterAddress(gen.fromAddressContainer, schedule.fromAddress, frame)
    );
    await actor.browse().fill(gen.subjectInput, schedule.subject);
    await actor.browse().fill(gen.bodyEditor, schedule.body);
    await actor.browse().setChecked(gen.additionalRecipientsCheckbox, schedule.appendAdditionalRecipients);
  }
}

async function fillDisplayField(actor: WebActor, field: DisplayField): Promise<void> {
  const fieldsTab = ReportDesignerTargets.fieldsTab;
  const draggable = fieldsTab.draggableFieldByName(field.name);
  const draggableClasses = await actor.browse().getAttribute(draggable, 'class');

  if (!draggableClasses?.includes('ui-draggable-disabled')) {
    await actor.browse().dragTo(draggable, fieldsTab.lastDropzone);
  }

  await actor.browse().fill(fieldsTab.aliasInput(field.name), field.alias);

  await actor.browse().click(fieldsTab.displaySelector(field.name));
  await actor.browse().click(ReportDesignerTargets.optionByName(field.display));

  const sortClasses = await actor.browse().getAttribute(fieldsTab.sortSelectorStateSpan(field.name), 'class');
  if (!sortClasses?.includes('k-state-disabled')) {
    await actor.browse().click(fieldsTab.sortSelector(field.name));
    await actor.browse().click(ReportDesignerTargets.optionByName(field.sort));
  }
}

async function fillFieldsTab(actor: WebActor, report: Report): Promise<void> {
  const fieldsTab = ReportDesignerTargets.fieldsTab;
  await actor.browse().click(ReportDesignerTargets.fieldsTabButton);

  for (const field of report.displayFields) {
    await fillDisplayField(actor, field);
  }

  for (const data of report.relatedData) {
    await actor.browse().click(fieldsTab.addRelatedAppButton(report.appName));
    await actor.browse().click(fieldsTab.relatedDataReferenceSelector);
    await actor.browse().click(ReportDesignerTargets.optionByName(data.referenceField));
    await actor.browse().click(fieldsTab.relatedDataAddButton);

    for (const field of data.displayFields) {
      await fillDisplayField(actor, field);
    }
  }
}

async function fillChartDataRules(actor: WebActor, chart: AdvancedChart): Promise<void> {
  const chartData = ReportDesignerTargets.visualTab.chartData;
  const frame = ReportDesignerTargets.frame;

  const ruleCount = await actor.browse().count(chartData.ruleListItems);
  for (let i = 0; i < ruleCount; i++) {
    await actor.browse().click(chartData.firstRuleDeleteButton);
  }

  const selectAndAddRule = async (
    ruleType: 'Group Data' | 'Summary Data' | 'Series Data',
    addValueTask: () => Promise<void>
  ) => {
    await actor.browse().click(chartData.dataSelector);
    await actor.browse().click(ReportDesignerTargets.optionByName(ruleType));
    await addValueTask();
    await actor.browse().click(chartData.addButton);
  };

  await selectAndAddRule('Group Data', async () => {
    await actor.browse().click(chartData.groupDataSelector);
    await actor.browse().click(ReportDesignerTargets.optionByName(chart.groupData));
  });

  await selectAndAddRule('Summary Data', async () => {
    await actor.attemptsTo(TreeviewSelectorTasks.selectOption(chartData.summaryDataSelector, chart.summaryData, frame));
  });

  await selectAndAddRule('Series Data', async () => {
    await actor.attemptsTo(TreeviewSelectorTasks.selectOption(chartData.seriesDataSelector, chart.seriesData, frame));
  });

  if (chart instanceof BubbleChart) {
    await selectAndAddRule('Group Data', async () => {
      await actor.browse().click(chartData.groupDataSelector);
      await actor.browse().click(ReportDesignerTargets.optionByName(chart.additionalGroupData));
    });
  }
}

async function fillVisualTab(actor: WebActor, report: Report): Promise<void> {
  const visual = ReportDesignerTargets.visualTab;
  const frame = ReportDesignerTargets.frame;

  await actor.browse().click(ReportDesignerTargets.visualTabButton);
  await actor.browse().waitForTimeout(1000);

  await actor.browse().click(visual.displayTypeSelector);
  await actor.browse().click(ReportDesignerTargets.optionByName(report.displayType));

  if (report instanceof SavedReportAsReportDataOnly && report.relatedData.length === 0) {
    await actor.browse().setChecked(visual.bulkEditCheckbox, report.bulkEdit);
    await actor.browse().setChecked(visual.bulkDeleteCheckbox, report.bulkDelete);
  }

  if (report instanceof SavedReportAsChart) {
    await actor.browse().click(visual.chartModeOption(report.chart.mode));
    await actor.browse().click(visual.chartTypeSelector);
    await actor.browse().click(ReportDesignerTargets.firstOptionByName(report.chart.type));

    if (report.chart instanceof AdvancedChart) {
      await fillChartDataRules(actor, report.chart);
    } else {
      await actor.browse().click(visual.groupDataSelector);
      await actor.browse().click(ReportDesignerTargets.optionByName(report.chart.groupData));
      await actor.attemptsTo(
        TreeviewSelectorTasks.selectOption(visual.summaryDataSelector, report.chart.summaryData, frame)
      );
    }

    if (report.chart instanceof ColumnPlusLineChart || report.chart instanceof StackedColumnPlusLineChart) {
      const lineChart = report.chart.lineChart;
      if (!(lineChart instanceof SavedReportAsChart)) {
        throw new Error('Using line chart is not implemented');
      }

      const isLineChart = lineChart.chart instanceof LineChart || lineChart.chart instanceof SplineChart;
      if (!isLineChart) {
        throw new Error("Saved report's chart must be a line or spline chart");
      }

      await actor.browse().click(visual.lineChartConfig.sourceSelector);
      await actor.browse().click(ReportDesignerTargets.optionByName('Use an existing chart report'));
      await actor.browse().waitForTimeout(1000);

      await actor.browse().click(visual.lineChartConfig.appSelector);
      await actor.browse().click(ReportDesignerTargets.optionByName(lineChart.appName));
      await actor.browse().waitForTimeout(1000);

      await actor.browse().click(visual.lineChartConfig.existingChartSelector);
      await actor.browse().click(ReportDesignerTargets.optionByName(lineChart.name));
    }

    if (report.chart instanceof HeatMapChart) {
      for (const [index, colorStop] of report.chart.colorStops.entries()) {
        await actor.browse().click(visual.colorStopsGrid.addValueButton);
        await actor.browse().waitForState(visual.colorStopsGrid.rowAt(index), 'visible');
        await actor.browse().focus(visual.colorStopsGrid.valueInputAt(index));
        await actor.browse().fill(visual.colorStopsGrid.valueInputAt(index), colorStop.value.toString());
        await actor.attemptsTo(
          ColorPickerControlTasks.pickColor(visual.colorStopsGrid.colorPickerAt(index), colorStop.color, frame)
        );
      }
    }

    await actor.browse().click(visual.visibilitySelector);
    await actor.browse().click(ReportDesignerTargets.optionByName(report.chart.visibility));

    for (const option of report.chart.displayOptions) {
      await actor.browse().setChecked(visual.displayOptionCheckbox(option.name), option.status);
    }
  }

  if (report instanceof SavedReportAsCalendar) {
    await actor.browse().click(visual.colorBasedOnSelector);
    await actor.browse().click(ReportDesignerTargets.optionByName(report.colorBasedOn));

    await actor.browse().click(visual.defaultViewSelector);
    await actor.browse().click(ReportDesignerTargets.optionByName(report.defaultView));

    for (const [index, value] of report.calendarValues.entries()) {
      await actor.browse().click(visual.calendarValuesGrid.addValueButton);
      await actor.browse().waitForState(visual.calendarValuesGrid.rowAt(index), 'visible');

      await actor.browse().click(visual.calendarValuesGrid.fieldSelectorAt(index, 'startFieldConfigId'));
      await actor.browse().click(ReportDesignerTargets.optionByName(value.startDateField));

      if (value.endDateField) {
        await actor.browse().click(visual.calendarValuesGrid.fieldSelectorAt(index, 'endFieldConfigId'));
        await actor.browse().click(ReportDesignerTargets.optionByName(value.endDateField));
      }

      if (value.color) {
        await actor.attemptsTo(
          ColorPickerControlTasks.pickColor(visual.calendarValuesGrid.colorPickerAt(index), value.color, frame)
        );
      }
    }

    await actor.attemptsTo(DualPaneSelector.selectOptions(visual.agendaFieldsSelector, report.agendaFields, frame));

    await actor.browse().click(visual.initialDateSelector);
    await actor.browse().click(ReportDesignerTargets.optionByName(report.initialDate));
  }

  if (report instanceof SavedReportAsGanttChart) {
    if (report.groupData) {
      await actor.browse().click(visual.groupDataSelector);
      await actor.browse().click(ReportDesignerTargets.optionByName(report.groupData));
    }

    await actor.attemptsTo(
      DualPaneSelector.selectOptions(visual.rowHeaderFieldsSelector, report.rowHeaderFields, frame)
    );

    await actor.browse().click(visual.colorBasedOnSelector);
    await actor.browse().click(ReportDesignerTargets.optionByName(report.colorBasedOn));

    for (const [index, value] of report.ganttValues.entries()) {
      await actor.browse().click(visual.ganttValuesGrid.addValueButton);
      await actor.browse().waitForState(visual.ganttValuesGrid.rowAt(index), 'visible');

      await actor.browse().click(visual.ganttValuesGrid.fieldSelectorAt(index, 'startFieldConfigId'));
      await actor.browse().click(ReportDesignerTargets.optionByName(value.startDateField));

      if (value.endDateField) {
        await actor.browse().click(visual.ganttValuesGrid.fieldSelectorAt(index, 'endFieldConfigId'));
        await actor.browse().click(ReportDesignerTargets.optionByName(value.endDateField));
      }

      if (value.percentCompleteField) {
        await actor.browse().click(visual.ganttValuesGrid.fieldSelectorAt(index, 'pctCompleteFieldConfigId'));
        await actor.browse().click(ReportDesignerTargets.optionByName(value.percentCompleteField));
      }

      if (value.dependencyField) {
        await actor.browse().click(visual.ganttValuesGrid.fieldSelectorAt(index, 'dependencyFieldConfigId'));
        await actor.browse().click(ReportDesignerTargets.optionByName(value.dependencyField));
      }

      if (value.labelField) {
        await actor.browse().click(visual.ganttValuesGrid.fieldSelectorAt(index, 'labelFieldConfigId'));
        await actor.browse().click(ReportDesignerTargets.optionByName(value.labelField));
      }

      if (value.legendText) {
        await actor.browse().focus(visual.ganttValuesGrid.legendTextInputAt(index));
        await actor.browse().fill(visual.ganttValuesGrid.legendTextInputAt(index), value.legendText);
      }

      if (value.color) {
        await actor.attemptsTo(
          ColorPickerControlTasks.pickColor(visual.ganttValuesGrid.colorPickerAt(index), value.color, frame)
        );
      }
    }

    if (report.milestoneField) {
      await actor.browse().click(visual.milestoneFieldSelector);
      await actor.browse().click(ReportDesignerTargets.optionByName(report.milestoneField));
    }

    for (const option of report.displayOptions) {
      await actor.browse().setChecked(visual.displayOptionCheckbox(option.name), option.status);
    }

    await actor.attemptsTo(DualPaneSelector.selectOptions(visual.timeIncrementsSelector, report.timeIncrements, frame));

    await actor.browse().click(visual.timeFrameDisplaySelector);
    await actor.browse().click(ReportDesignerTargets.optionByName(report.timeFrameDisplay));
  }

  if (report instanceof SavedReportAsPointMap) {
    await actor.browse().click(visual.visibilitySelector);
    await actor.browse().click(ReportDesignerTargets.optionByName(report.visibility));

    for (const option of report.displayOptions) {
      await actor.browse().setChecked(visual.displayOptionCheckbox(option.name), option.status);
    }

    await actor.browse().click(visual.markerDataGrid.markerNameSelector);
    await actor.browse().click(ReportDesignerTargets.optionByName(report.markerNameField));

    await actor.browse().setChecked(visual.includeViewRecordCheckbox, report.includeViewRecordLink);

    await actor.browse().click(visual.markerColorBasedOnSelector);
    await actor.browse().click(ReportDesignerTargets.optionByName(report.basedOnColor));

    await actor.attemptsTo(ColorPickerControlTasks.pickColor(visual.markerColorPicker, report.selectedColor, frame));
  }
}

async function fillReportDesignerAndRun(actor: WebActor, report: Report): Promise<void> {
  await actor.browse().waitForState(ReportDesignerTargets.modal, 'visible');
  await actor.browse().waitForState(ReportDesignerTargets.fieldsTabButton, 'visible');

  if (report instanceof SavedReport) {
    await fillGeneralTab(actor, report);
  }

  await fillFieldsTab(actor, report);
  await fillVisualTab(actor, report);

  const navPromise = actor.browse().waitForUrl(ReportPageTargets.pathRegex);
  await actor.browse().click(ReportDesignerTargets.saveAndRunButton);
  await navPromise;
  await actor.attemptsTo(ReportTasks.waitUntilLoaded());
}

export const ReportTasks = {
  gotoReportHome:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const getAppsListResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => r.url().includes(ReportHomePageTargets.getAppsListPath) && r.status() === 200
        );
      await actor.browse().goto(ReportHomePageTargets.route);
      await getAppsListResponse;
    },

  gotoAppReports:
    (appId: number): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const getReportsResponse = actor
        .browse()
        .waitForResponse((r: Response) => ReportAppPageTargets.getReportsPathRegex.test(r.url()) && r.status() === 200);
      await actor.browse().goto(ReportAppPageTargets.routeForApp(appId));
      await getReportsResponse;
    },

  gotoReport:
    (reportId: number): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().goto(ReportPageTargets.routeForReport(reportId));
      await actor.attemptsTo(ReportTasks.waitUntilLoaded());
    },

  waitUntilLoaded:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().waitForState(ReportPageTargets.copyrightPatentInfo, 'hidden');
    },

  createFromReportHome:
    (report: Report): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(ReportHomePageTargets.createReportButton);
      await actor.browse().click(ReportHomePageTargets.createMenuOption(report.appName));
      await fillAddReportDialog(actor, report);
      await fillReportDesignerAndRun(actor, report);
    },

  createFromAppReports:
    (report: Report): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(ReportAppPageTargets.createReportButton);
      await fillAddReportDialog(actor, report);
      await fillReportDesignerAndRun(actor, report);
    },

  createCopyFromReportHome:
    (reportToCopy: string, report: Report): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(ReportHomePageTargets.createReportButton);
      await actor.browse().click(ReportHomePageTargets.createMenuOption(report.appName));
      await fillAddReportDialog(actor, report, reportToCopy);
      await fillReportDesignerAndRun(actor, report);
    },

  createCopyFromAppReports:
    (reportToCopy: string, report: Report): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(ReportAppPageTargets.createReportButton);
      await fillAddReportDialog(actor, report, reportToCopy);
      await fillReportDesignerAndRun(actor, report);
    },

  createSavedDataReport:
    (appId: number, report: SavedReportAsReportDataOnly): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(ReportTasks.gotoAppReports(appId), ReportTasks.createFromAppReports(report));
    },

  update:
    (report: Report): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(ReportPageTargets.editReportButton);
      await fillReportDesignerAndRun(actor, report);
    },

  delete:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(ReportPageTargets.actionMenuButton);
      await actor.browse().waitForState(ReportPageTargets.actionMenu, 'visible');
      await actor.browse().click(ReportPageTargets.actionMenuItem('Delete Report'));
      await actor.browse().click(DeleteDialogTargets.deleteButton);
      await actor.browse().waitForDetached(DeleteDialogTargets.dialog, DeleteDialogTargets.overlay);
      await actor.browse().waitForUrl(ReportAppPageTargets.pathRegex);
      await actor.browse().waitForLoadState('load');
    },

  selectAllRecords:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(ReportPageTargets.selectAllCheckbox);
    },

  bulkEdit:
    (updates: { field: LayoutItem; value: string }[]): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(ReportPageTargets.bulkActionButton);
      await actor.browse().waitForState(ReportPageTargets.bulkActionMenu, 'visible');
      await actor.browse().click(ReportPageTargets.bulkActionMenuItem('Edit Selected Records'));
      await actor.browse().waitForState(ReportPageTargets.bulkEditModal.modal, 'visible');

      for (const update of updates) {
        if (update.field instanceof ListField) {
          await actor.browse().click(ReportPageTargets.bulkEditModal.fieldByLabel(update.field.name));
          await actor.browse().click(ReportPageTargets.optionByName(update.value));
        } else {
          throw new Error(`Bulk edit for field type "${update.field.type}" is not implemented.`);
        }
      }

      await actor.browse().click(ReportPageTargets.bulkEditModal.saveButton);
      await actor.browse().waitForState(ReportPageTargets.bulkEditModal.progressDialog, 'visible');
      await actor.browse().waitForState(ReportPageTargets.bulkEditModal.progressDialog, 'hidden');
      await actor.browse().waitForUrl(ReportPageTargets.pathRegex);
      await actor.attemptsTo(ReportTasks.waitUntilLoaded());
    },

  bulkDelete:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(ReportPageTargets.bulkActionButton);
      await actor.browse().waitForState(ReportPageTargets.bulkActionMenu, 'visible');
      await actor.browse().click(ReportPageTargets.bulkActionMenuItem('Delete Selected Records'));
      await actor.browse().click(DeleteDialogTargets.deleteButton);
      await actor.browse().waitForState(ReportPageTargets.bulkDeleteDialog.progressDialog, 'visible');
      await actor.browse().waitForDetached(ReportPageTargets.bulkDeleteDialog.progressDialog);
      await actor.browse().waitForUrl(ReportPageTargets.pathRegex);
      await actor.attemptsTo(ReportTasks.waitUntilLoaded());
    },

  applyLiveFilter:
    ({
      fieldName,
      fieldType,
      operator,
      value,
    }: {
      fieldName: string;
      fieldType: FieldType;
      operator: string;
      value: string;
    }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(ReportPageTargets.columnFilterButton(fieldName));
      await actor.browse().waitForState(ReportPageTargets.liveFilterMenu, 'visible');

      switch (fieldType) {
        case 'List': {
          await actor.browse().click(ReportPageTargets.liveFilterOperatorDropdown);
          await actor.browse().click(ReportPageTargets.optionByName(operator));
          await actor.attemptsTo(DualPaneSelector.selectOption(ReportPageTargets.liveFilterListSelector, value));
          break;
        }
        default:
          throw new Error(`Field type "${fieldType}" is not supported.`);
      }

      const recordListResponse = actor
        .browse()
        .waitForResponse((r: Response) => ReportPageTargets.recordListPathRegex.test(r.url()) && r.status() === 200);
      await actor.browse().click(ReportPageTargets.liveFilterApplyButton);
      await recordListResponse;
    },

  sortByField:
    ({ fieldName, sortOrder }: { fieldName: string; sortOrder: 'asc' | 'desc' }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const headerCell = ReportPageTargets.columnHeader(fieldName);

      while ((await actor.browse().getAttribute(headerCell, 'data-dir')) !== sortOrder) {
        const recordListResponse = actor
          .browse()
          .waitForResponse((r: Response) => ReportPageTargets.recordListPathRegex.test(r.url()) && r.status() === 200);
        await actor.browse().click(headerCell);
        await recordListResponse;
      }
    },

  filterByText:
    (text: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const recordListResponse = actor
        .browse()
        .waitForResponse((r: Response) => ReportPageTargets.recordListPathRegex.test(r.url()) && r.status() === 200);
      await actor.browse().type(ReportPageTargets.filterInput, text, { delay: 150, clear: false });
      await recordListResponse;
    },

  exportReport:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(ReportPageTargets.actionMenuButton);
      await actor.browse().waitForState(ReportPageTargets.actionMenu, 'visible');
      await actor.browse().click(ReportPageTargets.actionMenuItem('Export Report'));
      await actor.browse().click(ReportPageTargets.exportReportModal.exportButton);
      await actor.browse().waitForState(ReportPageTargets.exportUnderwayDialog.dialog, 'visible');
      await actor.browse().click(ReportPageTargets.exportUnderwayDialog.closeButton);
    },

  printReport:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(ReportPageTargets.actionMenuButton);
      await actor.browse().waitForState(ReportPageTargets.actionMenu, 'visible');
      await actor.browse().click(ReportPageTargets.actionMenuItem('Print Report'));
      await actor.browse().waitForState(ReportPageTargets.printReportModal.dialog, 'visible');
      await actor.browse().click(ReportPageTargets.printReportModal.okButton);
    },

  expandMasterRow:
    (index: number): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const detailListResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => ReportPageTargets.detailRecordListPathRegex.test(r.url()) && r.status() === 200
        );
      await actor.browse().click(ReportPageTargets.masterRowExpandLink(index));
      await detailListResponse;
    },

  selectCalendarDate:
    (date: Date): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const shortDateString = `${month}/${day}/${year}`;
      const currentShortDate = await actor.browse().textContent(ReportPageTargets.calendarChart.shortDate);

      if (currentShortDate === shortDateString) {
        return;
      }

      await actor.browse().click(ReportPageTargets.calendarChart.datePickerButton);
      await actor.attemptsTo(DatePickerTasks.selectDate(year, month, day));
    },

  mockLineChartSeriesName:
    (appName: string, mockAppName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor
        .browse()
        .interceptJsonResponseOnce<ReportDisplayConfigBody>(ReportPageTargets.getReportDisplayConfigPathRegex, body => {
          const lineChartSeries = body.chartConfig.chartConfigData.dataset.find(d => d.seriesName === appName);

          if (lineChartSeries === undefined) {
            throw new Error(`Series with name ${appName} not found in the chart config.`);
          }

          lineChartSeries.seriesName = mockAppName;
        });
    },
};
