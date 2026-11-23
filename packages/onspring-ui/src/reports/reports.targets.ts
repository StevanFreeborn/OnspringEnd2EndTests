import { Locator, Page } from '@playwright/test';
import { Target } from '@stevanfreeborn/screenplay-playwright';

const reportDesignerFrame = (page: Page) =>
  page.getByRole('dialog', { name: /report designer/i }).frameLocator('iframe');

const colorStopsGridBody = (page: Page) => reportDesignerFrame(page).locator('#ColorStops .k-grid-content');
const calendarValuesGridBody = (page: Page) => reportDesignerFrame(page).locator('#CalendarValues .k-grid-content');
const ganttValuesGridBody = (page: Page) => reportDesignerFrame(page).locator('#GanttValues .k-grid-content');
const reportDataGrid = (page: Page) => page.locator('#report-contents #grid');

export const ReportHomePageTargets = {
  route: '/Report',
  getAppsListPath: '/Report/AppsListRead',
  pathRegex: /\/Report/,
  createReportButton: (page: Page): Locator => page.getByRole('button', { name: 'Create Report' }),
  createMenuOption:
    (appName: string): Target =>
    (page: Page): Locator =>
      page.locator('#create-menu').getByText(appName, { exact: true }),
};

export const ReportAppPageTargets = {
  routeForApp: (appId: number): string => `/Report/App/${appId}`,
  pathRegex: /\/Report\/App\/\d+/,
  getReportsPathRegex: /\/Report\/ReportList\/\d+/,
  createReportButton: (page: Page): Locator => page.getByRole('button', { name: 'Create Report' }),
  allReportsGrid: (page: Page): Locator => page.locator('#grid-0'),
  reportRowByName:
    (name: string): Target =>
    (page: Page): Locator =>
      page.locator('#grid-0').getByRole('row', { name }),
};

export const AddReportDialogTargets = {
  blankReportRadioButton: (page: Page): Locator => page.getByRole('radio', { name: 'A blank report' }),
  copyReportRadioButton: (page: Page): Locator => page.getByRole('radio', { name: 'A copy of' }),
  reportToCopySelector: (page: Page): Locator => page.locator('.copy-from-dropdown'),
  tempReportRadioButton: (page: Page): Locator =>
    page.getByRole('radio', { name: 'Add as a temporary report (can be saved later)' }),
  savedReportRadioButton: (page: Page): Locator => page.getByRole('radio', { name: 'Create as a saved report' }),
  reportNameInput: (page: Page): Locator => page.getByPlaceholder('Report Name', { exact: true }),
  schedulingSelector: (page: Page): Locator =>
    page.locator('.label:has-text("Scheduling") + .data').getByRole('listbox'),
  securitySelector: (page: Page): Locator => page.locator('.label:has-text("Security") + .data').getByRole('listbox'),
  optionByName:
    (name: string): Target =>
    (page: Page): Locator =>
      page.getByRole('option', { name, exact: true }),
  saveButton: (page: Page): Locator => page.getByRole('button', { name: 'Save' }),
};

export const ReportDesignerTargets = {
  frame: reportDesignerFrame,
  modal: (page: Page): Locator => page.getByRole('dialog', { name: /report designer/i }),
  saveAndRunButton: (page: Page): Locator =>
    page.getByRole('dialog', { name: /report designer/i }).getByRole('button', { name: 'Save Changes & Run' }),
  generalTabButton: (page: Page): Locator => reportDesignerFrame(page).getByRole('tab', { name: 'General' }),
  fieldsTabButton: (page: Page): Locator => reportDesignerFrame(page).getByRole('tab', { name: 'Fields' }),
  visualTabButton: (page: Page): Locator => reportDesignerFrame(page).getByRole('tab', { name: 'Visual' }),
  optionByName:
    (name: string): Target =>
    (page: Page): Locator =>
      reportDesignerFrame(page).getByRole('option', { name }),
  firstOptionByName:
    (name: string): Target =>
    (page: Page): Locator =>
      reportDesignerFrame(page).getByRole('option', { name }).first(),
  generalTab: {
    nameInput: (page: Page): Locator => reportDesignerFrame(page).getByLabel('Report Name'),
    descriptionEditor: (page: Page): Locator =>
      reportDesignerFrame(page)
        .locator('.label:has-text("Description") + .data')
        .locator('.content-area.mce-content-body'),
    scheduleStatusSwitch: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Schedule") + .data').getByRole('switch'),
    scheduleStatusToggle: (page: Page): Locator =>
      reportDesignerFrame(page)
        .locator('.label:has-text("Schedule") + .data')
        .getByRole('switch')
        .locator('span')
        .nth(3),
    sendFrequencySelector: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Send") + .data').last().getByRole('listbox'),
    startingOnDateControl: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Starting On") + .data'),
    endingOnDateControl: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Ending On") + .data'),
    sendAsSelector: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Send As") + .data').getByRole('listbox'),
    typeSelector: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Type") + .data').getByRole('listbox'),
    dataSelector: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Data") + .data').first().getByRole('listbox'),
    doNotSendIfEmptyCheckbox: (page: Page): Locator =>
      reportDesignerFrame(page).getByRole('checkbox', { name: 'Do not send if the report is empty' }),
    dataFormatSelector: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Data Format") + .data').getByRole('listbox'),
    numberDateFormatSelector: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Number/Date Format") + .data').getByRole('listbox'),
    includeAllLevelsCheckbox: (page: Page): Locator =>
      reportDesignerFrame(page).getByRole('checkbox', { name: 'Include All Levels' }),
    specificGroupsSelector: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Specific Groups") + .data'),
    specificUsersSelector: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Specific Users") + .data'),
    fromNameInput: (page: Page): Locator => reportDesignerFrame(page).getByLabel('From Name'),
    fromAddressContainer: (page: Page): Locator => reportDesignerFrame(page).locator('.from-email-container'),
    subjectInput: (page: Page): Locator => reportDesignerFrame(page).getByLabel('Subject'),
    bodyEditor: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Message") + .data').locator('.content-area.mce-content-body'),
    additionalRecipientsCheckbox: (page: Page): Locator =>
      reportDesignerFrame(page).getByLabel('Additional Recipients'),
  },
  fieldsTab: {
    draggableFieldByName:
      (fieldName: string): Target =>
      (page: Page): Locator =>
        reportDesignerFrame(page).locator('.item-lists').locator(`.draggable:visible:has-text("${fieldName}")`),
    lastDropzone: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.display-field-container').locator('[data-column]').last(),
    lastDisplayFieldForm:
      (fieldName: string): Target =>
      (page: Page): Locator =>
        reportDesignerFrame(page)
          .locator('.display-field-container')
          .locator('.display-field', {
            has: reportDesignerFrame(page).locator(`[data-field-id]:has-text("${fieldName}")`),
          })
          .last(),
    aliasInput:
      (fieldName: string): Target =>
      (page: Page): Locator =>
        reportDesignerFrame(page)
          .locator('.display-field-container')
          .locator('.display-field', {
            has: reportDesignerFrame(page).locator(`[data-field-id]:has-text("${fieldName}")`),
          })
          .last()
          .locator('[data-report-field-alias]'),
    displaySelector:
      (fieldName: string): Target =>
      (page: Page): Locator =>
        reportDesignerFrame(page)
          .locator('.display-field-container')
          .locator('.display-field', {
            has: reportDesignerFrame(page).locator(`[data-field-id]:has-text("${fieldName}")`),
          })
          .last()
          .getByRole('listbox')
          .first(),
    sortSelector:
      (fieldName: string): Target =>
      (page: Page): Locator =>
        reportDesignerFrame(page)
          .locator('.display-field-container')
          .locator('.display-field', {
            has: reportDesignerFrame(page).locator(`[data-field-id]:has-text("${fieldName}")`),
          })
          .last()
          .getByRole('listbox')
          .last(),
    sortSelectorStateSpan:
      (fieldName: string): Target =>
      (page: Page): Locator =>
        reportDesignerFrame(page)
          .locator('.display-field-container')
          .locator('.display-field', {
            has: reportDesignerFrame(page).locator(`[data-field-id]:has-text("${fieldName}")`),
          })
          .last()
          .getByRole('listbox')
          .last()
          .locator('span')
          .first(),
    addRelatedAppButton:
      (appName: string): Target =>
      (page: Page): Locator =>
        reportDesignerFrame(page)
          .locator('#nav-apps .app-node')
          .filter({ hasText: appName })
          .getByTitle('Add Related App/Survey'),
    relatedDataReferenceSelector: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.add-app-popover').getByRole('listbox'),
    relatedDataAddButton: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.add-app-popover').getByRole('link', { name: 'Add' }),
  },
  visualTab: {
    displayTypeSelector: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Display Type") + .data').getByRole('listbox'),
    bulkEditCheckbox: (page: Page): Locator => reportDesignerFrame(page).getByLabel('Allow bulk edit'),
    bulkDeleteCheckbox: (page: Page): Locator => reportDesignerFrame(page).getByLabel('Allow bulk delete'),
    visibilitySelector: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Visibility") + .data').getByRole('listbox'),
    groupDataSelector: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Group Data") + .data').getByRole('listbox'),
    summaryDataSelector: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Summary Data") + .data .onx-selector'),
    chartModeOption:
      (mode: string): Target =>
      (page: Page): Locator =>
        reportDesignerFrame(page).locator('.chart-mode').getByRole('radio', { name: mode }),
    chartTypeSelector: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Chart Type") + .data').getByRole('listbox'),
    displayOptionCheckbox:
      (optionName: string): Target =>
      (page: Page): Locator =>
        reportDesignerFrame(page)
          .locator('.label:has-text("Display Options") + .data')
          .getByRole('checkbox', { name: optionName }),
    chartData: {
      ruleListItems: (page: Page): Locator => reportDesignerFrame(page).locator('#Aggregates .rule-list [data-index]'),
      firstRuleDeleteButton: (page: Page): Locator =>
        reportDesignerFrame(page).locator('#Aggregates .rule-list [data-index]').first().getByTitle('Delete'),
      dataSelector: (page: Page): Locator =>
        reportDesignerFrame(page).locator('.label:has-text("Chart Data") + .data').getByRole('listbox').first(),
      groupDataSelector: (page: Page): Locator =>
        reportDesignerFrame(page).locator('.label:has-text("Chart Data") + .data #Groupings').getByRole('listbox'),
      summaryDataSelector: (page: Page): Locator =>
        reportDesignerFrame(page).locator('.label:has-text("Chart Data") + .data [data-advanced-aggregate-container]'),
      seriesDataSelector: (page: Page): Locator =>
        reportDesignerFrame(page).locator('.label:has-text("Chart Data") + .data #Series'),
      addButton: (page: Page): Locator =>
        reportDesignerFrame(page).locator('.label:has-text("Chart Data") + .data').getByRole('button', { name: 'Add' }),
    },
    lineChartConfig: {
      sourceSelector: (page: Page): Locator =>
        reportDesignerFrame(page)
          .locator('.label:has-text("Line Chart Configuration") + .data')
          .getByRole('listbox')
          .first(),
      appSelector: (page: Page): Locator =>
        reportDesignerFrame(page)
          .locator('.label:has-text("Line Chart Configuration") + .data')
          .getByRole('listbox')
          .nth(1),
      existingChartSelector: (page: Page): Locator =>
        reportDesignerFrame(page)
          .locator('.label:has-text("Line Chart Configuration") + .data [data-existing-subreport]')
          .getByRole('listbox'),
    },
    colorStopsGrid: {
      addValueButton: (page: Page): Locator =>
        reportDesignerFrame(page).locator('#ColorStops').getByRole('button', { name: 'Add Value' }),
      rowAt:
        (index: number): Target =>
        (page: Page): Locator =>
          colorStopsGridBody(page).getByRole('row').nth(index),
      valueInputAt:
        (index: number): Target =>
        (page: Page): Locator =>
          colorStopsGridBody(page).getByRole('row').nth(index).locator('td[data-field="value"] input:visible'),
      colorPickerAt:
        (index: number): Target =>
        (page: Page): Locator =>
          colorStopsGridBody(page).getByRole('row').nth(index).locator('td[data-field="color"] .k-colorpicker'),
    },
    colorBasedOnSelector: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Color Based On") + .data').getByRole('listbox'),
    defaultViewSelector: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Default View") + .data').getByRole('listbox'),
    agendaFieldsSelector: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Agenda Fields") + .data .onx-selector'),
    initialDateSelector: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Initial Date") + .data').getByRole('listbox'),
    calendarValuesGrid: {
      addValueButton: (page: Page): Locator =>
        reportDesignerFrame(page).locator('#CalendarValues').getByRole('button', { name: 'Add Value' }),
      rowAt:
        (index: number): Target =>
        (page: Page): Locator =>
          calendarValuesGridBody(page).getByRole('row').nth(index),
      fieldSelectorAt:
        (index: number, field: string): Target =>
        (page: Page): Locator =>
          calendarValuesGridBody(page)
            .getByRole('row')
            .nth(index)
            .locator(`td[data-field="${field}"]`)
            .getByRole('listbox'),
      colorPickerAt:
        (index: number): Target =>
        (page: Page): Locator =>
          calendarValuesGridBody(page).getByRole('row').nth(index).locator('td[data-field="color"] .k-colorpicker'),
    },
    rowHeaderFieldsSelector: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Row Header Fields") + .data .onx-selector'),
    timeIncrementsSelector: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Time Increments") + .data .onx-selector'),
    timeFrameDisplaySelector: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Timeframe Display") + .data').getByRole('listbox'),
    milestoneFieldSelector: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Milestone Field") + .data').getByRole('listbox'),
    ganttValuesGrid: {
      addValueButton: (page: Page): Locator =>
        reportDesignerFrame(page).locator('#GanttValues').getByRole('button', { name: 'Add Value' }),
      rowAt:
        (index: number): Target =>
        (page: Page): Locator =>
          ganttValuesGridBody(page).getByRole('row').nth(index),
      fieldSelectorAt:
        (index: number, field: string): Target =>
        (page: Page): Locator =>
          ganttValuesGridBody(page)
            .getByRole('row')
            .nth(index)
            .locator(`td[data-field="${field}"]`)
            .getByRole('listbox'),
      legendTextInputAt:
        (index: number): Target =>
        (page: Page): Locator =>
          ganttValuesGridBody(page).getByRole('row').nth(index).locator('td[data-field="legendText"] input:visible'),
      colorPickerAt:
        (index: number): Target =>
        (page: Page): Locator =>
          ganttValuesGridBody(page).getByRole('row').nth(index).locator('td[data-field="color"] .k-colorpicker'),
    },
    markerDataGrid: {
      markerNameSelector: (page: Page): Locator =>
        reportDesignerFrame(page)
          .locator('#MarkerData .k-grid-content')
          .getByRole('row', { name: 'Marker Title/Name' })
          .locator('td[data-field="dataFieldConfigId"]')
          .getByRole('listbox'),
    },
    includeViewRecordCheckbox: (page: Page): Locator =>
      reportDesignerFrame(page).getByLabel('Include "View Record" link in marker tooltip'),
    markerColorBasedOnSelector: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Marker Color Based On") + .data').getByRole('listbox'),
    markerColorPicker: (page: Page): Locator =>
      reportDesignerFrame(page).locator(
        '.label:has-text("Marker Color Based On") + .data .k-colorpicker .k-picker-wrap'
      ),
  },
};

export const ReportPageTargets = {
  routeForReport: (reportId: number): string => `/Report/${reportId}/Display`,
  pathRegex: /\/Report\/\d+\/Display/,
  recordListPathRegex: /\/Report\/\d+\/RecordList/,
  detailRecordListPathRegex: /\/Report\/\d+\/DetailRecordList/,
  getReportDisplayConfigPathRegex: /Report\/\d+\/GetReportDisplayConfig/,
  printEndpoint: (reportId: number): string => `/Report/${reportId}/Print`,
  copyrightPatentInfo: (page: Page): Locator => page.getByText('U.S. Patent No. 11,507,628'),
  breadcrumb: (page: Page): Locator => page.locator('.bcrumb-container'),
  reportContents: (page: Page): Locator => page.locator('#report-contents'),
  dataGridContainer: reportDataGrid,
  gridHeaders: (page: Page): Locator => reportDataGrid(page).locator('thead th'),
  columnHeader:
    (pattern: string | RegExp): Target =>
    (page: Page): Locator =>
      reportDataGrid(page).locator('thead th', { hasText: pattern }),
  columnFilterButton:
    (fieldName: string): Target =>
    (page: Page): Locator =>
      reportDataGrid(page).locator('thead th', { hasText: fieldName }).getByTitle('Filter'),
  gridRows: (page: Page): Locator => reportDataGrid(page).locator('tbody tr'),
  columnCellsAt:
    (columnIndex: number): Target =>
    (page: Page): Locator =>
      reportDataGrid(page).locator(`tbody tr td:nth-child(${columnIndex + 1})`),
  masterRows: (page: Page): Locator => reportDataGrid(page).locator('tbody tr.k-master-row'),
  masterRowExpandLink:
    (index: number): Target =>
    (page: Page): Locator =>
      reportDataGrid(page).locator('tbody tr.k-master-row').nth(index).locator('td').first().getByRole('link'),
  detailRowToolbar:
    (index: number, text: string): Target =>
    (page: Page): Locator =>
      reportDataGrid(page).locator('tbody tr.k-detail-row').nth(index).locator('.toolbar-container', { hasText: text }),
  detailRowHeader:
    (index: number, text: string): Target =>
    (page: Page): Locator =>
      reportDataGrid(page).locator('tbody tr.k-detail-row').nth(index).locator('thead th', { hasText: text }),
  detailRowRecord:
    (index: number, text: string): Target =>
    (page: Page): Locator =>
      reportDataGrid(page).locator('tbody tr.k-detail-row').nth(index).locator('tbody tr', { hasText: text }),
  selectAllCheckbox: (page: Page): Locator => reportDataGrid(page).locator('[data-select-all]'),
  bulkActionButton: (page: Page): Locator => reportDataGrid(page).locator('[data-bulk-menu-button]'),
  bulkActionMenu: (page: Page): Locator => reportDataGrid(page).locator('.popover-menu'),
  bulkActionMenuItem:
    (name: string): Target =>
    (page: Page): Locator =>
      reportDataGrid(page).locator('.popover-menu').getByText(name),
  actionMenuButton: (page: Page): Locator => page.locator('#action-menu-button'),
  actionMenu: (page: Page): Locator => page.locator('#action-menu'),
  actionMenuItem:
    (name: string): Target =>
    (page: Page): Locator =>
      page.locator('#action-menu').getByText(name),
  editReportButton: (page: Page): Locator => page.getByRole('link', { name: 'Edit Report' }),
  filterInput: (page: Page): Locator => page.getByPlaceholder('Filter'),
  liveFilterMenu: (page: Page): Locator => page.locator('.k-filter-menu'),
  liveFilterOperatorDropdown: (page: Page): Locator => page.locator('.k-filter-menu .k-dropdown.rule-operator'),
  liveFilterListSelector: (page: Page): Locator =>
    page.locator('.k-filter-menu .list.selector-container .onx-selector'),
  liveFilterApplyButton: (page: Page): Locator => page.locator('.k-filter-menu').getByText('Apply'),
  optionByName:
    (name: string): Target =>
    (page: Page): Locator =>
      page.getByRole('option', { name, exact: true }),
  bulkEditModal: {
    modal: (page: Page): Locator => page.getByRole('dialog', { name: /bulk edit/i }),
    fieldByLabel:
      (fieldName: string): Target =>
      (page: Page): Locator =>
        page.getByRole('dialog', { name: /bulk edit/i }).locator(`.label:has-text("${fieldName}") + .data`),
    saveButton: (page: Page): Locator =>
      page.getByRole('dialog', { name: /bulk edit/i }).getByRole('button', { name: 'Save' }),
    progressDialog: (page: Page): Locator => page.getByRole('dialog', { name: /updating records/i }),
  },
  bulkDeleteDialog: {
    progressDialog: (page: Page): Locator => page.getByRole('dialog', { name: 'Deleting Records' }),
  },
  exportReportModal: {
    exportButton: (page: Page): Locator =>
      page.getByRole('dialog', { name: 'Export Report' }).getByRole('button', { name: 'Export' }),
  },
  exportUnderwayDialog: {
    dialog: (page: Page): Locator => page.getByRole('dialog', { name: 'Export Underway' }),
    closeButton: (page: Page): Locator =>
      page.getByRole('dialog', { name: 'Export Underway' }).getByRole('button', { name: 'Close' }),
  },
  printReportModal: {
    dialog: (page: Page): Locator => page.getByRole('dialog', { name: 'Print Report' }),
    okButton: (page: Page): Locator =>
      page.getByRole('dialog', { name: 'Print Report' }).getByRole('button', { name: 'OK' }),
  },
  exportEmailDownloadLink: (page: Page): Locator => page.getByRole('link'),
  calendarChart: {
    shortDate: (page: Page): Locator => page.locator('#report-contents #calendar .k-sm-date-format'),
    datePickerButton: (page: Page): Locator => page.locator('#report-contents #calendar a.k-nav-current'),
  },
};
