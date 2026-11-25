import { Page } from '@playwright/test';
import { Target } from '@stevanfreeborn/screenplay-playwright';

export type SystemReportSortDirection = 'ascending' | 'descending';

export type SystemReportDatePreset =
  | 'All Dates'
  | 'Last 24 Hours'
  | 'Last 2 Days'
  | 'Last 5 Days'
  | 'Last 7 Days'
  | 'Last 14 Days'
  | 'Last Month';

export type SystemReportDateFilter = { type: SystemReportDatePreset } | { type: 'Custom Dates'; from: Date; to: Date };

export type AuditHistoryItemType =
  | 'All Item Types'
  | 'API Key'
  | 'App'
  | 'Dashboard'
  | 'Dashboard Container'
  | 'Dashboard Filter Config'
  | 'Dashboard Object'
  | 'Data Connector'
  | 'Document'
  | 'Email Body'
  | 'Email Sending Domain'
  | 'Email Sync'
  | 'Email Template'
  | 'Field'
  | 'Import'
  | 'Instance Configuration'
  | 'Layout'
  | 'Layout Object'
  | 'List'
  | 'Messaging Task'
  | 'Package'
  | 'Portal'
  | 'Record Retention'
  | 'Role'
  | 'SMS Sending Number'
  | 'Survey'
  | 'Survey Campaign'
  | 'Survey Page'
  | 'Text Message'
  | 'Trigger'
  | 'User'
  | 'Workflow Step';

export type AuditHistorySaveType = 'All Save Types' | 'Added' | 'Deleted' | 'Modified' | 'Approved' | 'Denied';

export type AuditHistoryFilter = {
  user?: string;
  saveType?: AuditHistorySaveType;
  itemType?: AuditHistoryItemType;
  appOrSurvey?: string;
};

export type AutomatedEmailSourceType =
  | 'Data Connector'
  | 'Email Body'
  | 'Record Retention'
  | 'Scheduled Report'
  | 'Unlaunched Survey'
  | 'Workflow Finish'
  | 'Workflow Step';

export type AutomatedEmailSourceFilter = {
  emailType?: AutomatedEmailSourceType;
  appOrSurvey?: string;
  group?: string;
  user?: string;
};

export type AutomatedEmailSourceSortColumn = 'App/Survey Name' | 'Item Name';

export type BillingUsageHistoryIncrement = 'Day' | 'Week' | 'Month' | 'Year';

export type BillingUsageHistoryFilter =
  | {
      type: 'All Dates' | 'Last Month' | 'Last 3 Months' | 'Last 6 Months' | 'Last 12 Months';
      increment: BillingUsageHistoryIncrement;
    }
  | {
      type: 'Custom Dates';
      startDate: Date;
      endDate: Date;
      increment: BillingUsageHistoryIncrement;
    };

export type BillingDataUsageSortColumn = 'App ID' | 'App Name' | 'Total Records' | 'Total Size (GB)';

export type BillingFileStorageSortColumn = 'App ID' | 'App/Survey Name' | 'Total Files' | 'File Size (GB)';

export type EmailConfigType =
  | 'All Email Types'
  | 'Email Body'
  | 'Scheduled Report'
  | 'Scheduled Dashboard'
  | 'Survey Campaign'
  | 'Workflow Approval'
  | 'Workflow Rejection'
  | 'Workflow Step';

export type EmailConfigStatus = 'All' | 'OK' | 'Requires Attention';

export type EmailConfigFilter = {
  type: EmailConfigType;
  status: EmailConfigStatus;
  appOrSurvey: string;
};

export type EmailConfigSortColumn =
  | 'App/Survey Name'
  | 'Email Type'
  | 'Item Name'
  | 'Current From Name'
  | 'Current From Address'
  | 'From Address Status';

export type EmailHistoryType =
  | 'Admin Report Export'
  | 'Billed For App'
  | 'Billed For User'
  | 'Community Access'
  | 'Dashboard Export'
  | 'Data Connector'
  | 'Document Generation'
  | 'Import'
  | 'Messaging'
  | 'Package Import'
  | 'Password Reset'
  | 'Password Setup'
  | 'Pending Email Task'
  | 'Pending Text Message Task'
  | 'Record Retention'
  | 'Report Export'
  | 'SMS Registration Approved'
  | 'SMS Registration Rejected'
  | 'SMS Registration Submitted'
  | 'Survey Campaign'
  | 'Survey Delegated Pages Complete'
  | 'Survey Delegate'
  | 'Survey Password Reset'
  | 'SMS Limit Approaching'
  | 'SMS Limit Exceeded'
  | 'SMS Sign Up'
  | 'Unlaunched Survey'
  | 'Workflow'
  | 'Workflow Finish';

export type EmailHistorySortColumn =
  | 'Email Type'
  | 'To Name'
  | 'To Address'
  | 'From Address'
  | 'Subject'
  | 'Time Created'
  | 'Time Sent';

export type InvalidFormulasSortColumn = 'App/Survey Name' | 'Field Name' | 'Last Saved';

export type InvalidTriggersSortColumn = 'App/Survey Name' | 'Trigger Name' | 'Last Saved';

export type LoginHistoryFilter = {
  user?: string;
  displayLoggedInUsersOnly?: boolean;
  dateFilter?: SystemReportDateFilter;
};

export type PageHistoryHttpMethod = 'All HTTP Methods' | 'GET' | 'POST';

export type PageHistoryFilter = {
  user?: string;
  httpMethod?: PageHistoryHttpMethod;
  dateFilter?: SystemReportDateFilter;
};

export type SystemAdministratorListingSortColumn = 'Name' | 'Username' | 'Email Address' | 'Added';

export type SystemAdministratorListingFilter = {
  dateFilter?: SystemReportDateFilter;
};

export type UserUsageUserTier = 'Full User' | 'Portal User' | 'Lite User';
export type UserUsageUserStatus = 'Active' | 'Inactive';
export type UserUsageSortColumn = 'Full Name' | 'Username' | 'Email Address';

export type UserUsageFilter = {
  name?: string;
  status?: UserUsageUserStatus;
  tier?: UserUsageUserTier;
};

const listboxByLabel =
  (label: string): Target =>
  (page: Page) =>
    page.locator(`.label:has-text("${label}") + .data`).getByRole('listbox');

const textboxByLabel =
  (label: string): Target =>
  (page: Page) =>
    page.locator(`.label:has-text("${label}") + .data`).getByRole('textbox');

const gridHeader = (page: Page) => page.locator('#grid .k-grid-header');
const gridBody = (page: Page) => page.locator('#grid .k-grid-content');
const gridRows = (page: Page) => gridBody(page).locator('tr');
const fromDatePicker = (page: Page) => page.locator('.k-datetimepicker').first();
const toDatePicker = (page: Page) => page.locator('.k-datetimepicker').last();

const exportReportDialog = (page: Page) => page.getByRole('dialog', { name: 'Export Report' });

export const SystemReportCommonTargets = {
  optionByName:
    (name: string, exact?: boolean): Target =>
    (page: Page) =>
      page.getByRole('option', { name, exact }),
  exportReportDialog: {
    dialog: exportReportDialog,
    exportButton: (page: Page) => exportReportDialog(page).getByRole('button', { name: 'Export' }),
    closeButton: (page: Page) => exportReportDialog(page).getByRole('button', { name: 'Close' }),
  },
  exportEmailDownloadLink: (page: Page) => page.getByRole('link', { name: 'Download the export file' }),
};

export const AdminAuditHistoryReportTargets = {
  route: '/Admin/Reporting/Security/Audit',
  dataPath: '/Admin/Reporting/Security/GetAuditHistoryPage',
  userSelector: listboxByLabel('User'),
  saveTypeSelector: listboxByLabel('Save Type'),
  itemTypeSelector: listboxByLabel('Item Type'),
  appOrSurveySelector: listboxByLabel('App/Survey'),
  rows: gridRows,
  exportReportLink: (page: Page) => page.getByRole('link', { name: 'Export Report' }),
};

export const AutomatedEmailMessageSourcesReportTargets = {
  route: '/Admin/Reporting/Messaging/AutomatedSources',
  dataPath: '/Admin/Reporting/Messaging/GetAutomatedSourcesPage',
  emailTypeSelector: listboxByLabel('Email Type'),
  appOrSurveySelector: listboxByLabel('App/Survey'),
  groupSelector: listboxByLabel('Group'),
  userSelector: listboxByLabel('User'),
  gridHeader,
  rows: gridRows,
  rowAt:
    (index: number): Target =>
    (page: Page) =>
      gridRows(page).nth(index),
};

const billingUsageHistorySection = (page: Page) =>
  page.locator('section', { has: page.getByRole('heading', { name: 'Usage History' }) });

const billingDataUsageSection = (page: Page) =>
  page.locator('section', { has: page.getByRole('heading', { name: 'Detailed Data Usage By App Statistics' }) });

const billingFileStorageSection = (page: Page) =>
  page.locator('section', { has: page.getByRole('heading', { name: 'Detailed File Storage By App Statistics' }) });

export const BillingReportTargets = {
  route: '/Admin/Reporting/Billing/Usage',
  chartDataPath: '/Admin/Reporting/Billing/UsageChartData',
  dataUsagePath: '/Admin/Reporting/Billing/GetBillingDataUsagePage',
  fileStoragePath: '/Admin/Reporting/Billing/GetBillingFileStoragePage',
  usageHistory: {
    dateSelector: (page: Page) => billingUsageHistorySection(page).getByRole('listbox').first(),
    fromDateControl: (page: Page) => billingUsageHistorySection(page).locator('.k-datetimepicker').first(),
    toDateControl: (page: Page) => billingUsageHistorySection(page).locator('.k-datetimepicker').last(),
    incrementSelector: (page: Page) => billingUsageHistorySection(page).getByRole('listbox').last(),
    xAxisYearLabel:
      (year: string): Target =>
      (page: Page) =>
        page.locator(`#usage-chart-container [class*="dataset-axis"]:has-text("${year}")`),
  },
  dataUsage: {
    exportReportLink: (page: Page) => billingDataUsageSection(page).getByRole('link', { name: 'Export Report' }),
    gridHeader: (page: Page) => billingDataUsageSection(page).locator('#data-usage-grid .k-grid-header'),
    firstColumnCells: (page: Page) =>
      billingDataUsageSection(page).locator('#data-usage-grid .k-grid-content tr td:first-child'),
  },
  fileStorage: {
    exportReportLink: (page: Page) => billingFileStorageSection(page).getByRole('link', { name: 'Export Report' }),
    gridHeader: (page: Page) => billingFileStorageSection(page).locator('#file-storage-grid .k-grid-header'),
    firstColumnCells: (page: Page) =>
      billingFileStorageSection(page).locator('#file-storage-grid .k-grid-content tr td:first-child'),
  },
};

const bulkEditModal = (page: Page) => page.getByRole('dialog', { name: 'Bulk Edit: Email Messaging Configurations' });

export const EmailMessageConfigReportTargets = {
  route: '/Admin/Reporting/Messaging/Configurations',
  dataPath: '/Admin/Reporting/Messaging/GetConfigurationsPage',
  emailTypeSelector: listboxByLabel('Email Type'),
  fromAddressStatusSelector: listboxByLabel('From Address Status'),
  appOrSurveySelector: listboxByLabel('App/Survey'),
  gridHeader,
  rows: gridRows,
  rowAt:
    (index: number): Target =>
    (page: Page) =>
      gridRows(page).nth(index),
  rowByName:
    (name: string | RegExp): Target =>
    (page: Page) =>
      gridBody(page).getByRole('row', { name }),
  selectAllCheckbox: (page: Page) => page.locator('#grid [data-select-all]'),
  bulkActionButton: (page: Page) => page.locator('#grid [data-bulk-menu-button]'),
  bulkActionMenu: (page: Page) => page.locator('#grid .popover-menu'),
  editSelectedMenuOption: (page: Page) => page.locator('#grid .popover-menu').getByText('Edit Selected Configurations'),
  bulkEditModal: {
    modal: bulkEditModal,
    localPartInput: (page: Page) =>
      bulkEditModal(page).locator('.label:has-text("Local Part (mailbox)") + .data').getByRole('textbox'),
    domainSelector: (page: Page) =>
      bulkEditModal(page).locator('.label:has-text("Domain") + .data').getByRole('listbox'),
    saveButton: (page: Page) => bulkEditModal(page).getByRole('button', { name: 'Save' }),
    progressDialog: (page: Page) => page.getByRole('dialog', { name: /updating items/i }),
  },
};

const messageDetailModal = (page: Page) => page.getByRole('dialog', { name: 'Message Detail' });
const resendConfirmationDialog = (page: Page) => page.getByRole('dialog', { name: 'Resend Confirmation' });

export const EmailMessageHistoryReportTargets = {
  route: '/Admin/Reporting/Messaging/History',
  dataPath: '/Admin/Reporting/Messaging/GetHistoryPage',
  sessionStorageKey: 'onx.grid/Admin/Reporting/Messaging/History.grid',
  emailTypeSelector: (page: Page) => page.getByRole('listbox', { name: 'Email Type' }),
  appSelector: (page: Page) => page.getByRole('listbox', { name: 'App/Survey' }),
  gridHeader,
  rows: gridRows,
  firstRowSubjectCell: (page: Page) => gridRows(page).first().locator('td').nth(4),
  lastRowSubjectCell: (page: Page) => gridRows(page).last().locator('td').nth(4),
  rowBySubject:
    (subject: string | RegExp): Target =>
    (page: Page) =>
      gridBody(page).getByRole('row', { name: subject }),
  toNameLinkInRow:
    (subject: string | RegExp): Target =>
    (page: Page) =>
      gridBody(page).getByRole('row', { name: subject }).getByRole('gridcell').nth(1).getByRole('link'),
  resendLinkInRow:
    (subject: string | RegExp): Target =>
    (page: Page) =>
      gridBody(page).getByRole('row', { name: subject }).getByRole('link', { name: 'Resend' }),
  exportReportLink: (page: Page) => page.getByRole('link', { name: 'Export Report' }),
  messageDetailModal: {
    modal: messageDetailModal,
    subject: (page: Page) => messageDetailModal(page).locator('.label:has-text("Subject") + .data'),
    toLink: (page: Page) => messageDetailModal(page).locator('.label:has-text("To") + .data').getByRole('link'),
    emailBodyLink: (page: Page) =>
      messageDetailModal(page).locator('.label:has-text("Email Body") + .data').getByRole('link'),
    recordLink: (page: Page) => messageDetailModal(page).locator('.label:has-text("Record") + .data').getByRole('link'),
  },
  resendEmailDialog: {
    dialog: resendConfirmationDialog,
    okButton: (page: Page) => resendConfirmationDialog(page).getByRole('button', { name: 'OK' }),
    cancelButton: (page: Page) => resendConfirmationDialog(page).getByRole('button', { name: 'Cancel' }),
  },
};

export const InvalidFormulasReportTargets = {
  route: '/Admin/Reporting/Apps/InvalidFormulas',
  dataPath: '/Admin/Reporting/Apps/GetInvalidFormulaPage',
  appOrSurveySelector: listboxByLabel('App/Survey'),
  gridHeader,
  rows: gridRows,
  rowByText:
    (name: string | RegExp): Target =>
    (page: Page) =>
      gridBody(page).getByRole('row', { name }),
  editButtonInRow:
    (name: string | RegExp): Target =>
    (page: Page) =>
      gridBody(page).getByRole('row', { name }).getByTitle('Edit'),
  deleteButtonInRow:
    (name: string | RegExp): Target =>
    (page: Page) =>
      gridBody(page).getByRole('row', { name }).getByTitle('Delete'),
  lastSavedCells: (page: Page) => page.locator('#grid .k-grid-content tr td:nth-child(4)'),
};

export const InvalidTriggersReportTargets = {
  route: '/Admin/Reporting/Apps/InvalidTriggers',
  dataPath: '/Admin/Reporting/Apps/GetInvalidTriggerPage',
  appOrSurveySelector: listboxByLabel('App/Survey'),
  gridHeader,
  rows: gridRows,
  rowByText:
    (name: string | RegExp): Target =>
    (page: Page) =>
      gridBody(page).getByRole('row', { name }),
  deleteButtonInRow:
    (name: string | RegExp): Target =>
    (page: Page) =>
      gridBody(page).getByRole('row', { name }).getByTitle('Delete'),
  lastSavedCells: (page: Page) => page.locator('#grid .k-grid-content tr td:nth-child(4)'),
};

export const LoginHistoryReportTargets = {
  route: '/Admin/Reporting/Security/LoginHistory',
  dataPath: '/Admin/Reporting/Security/GetLoginHistory',
  userSelector: listboxByLabel('User'),
  displayLoggedInUsersOnlyCheckbox: (page: Page) =>
    page.getByRole('checkbox', { name: 'Display users currently logged in' }),
  dateFilterSelector: listboxByLabel('Date'),
  fromDateControl: fromDatePicker,
  toDateControl: toDatePicker,
  exportReportLink: (page: Page) => page.getByRole('link', { name: 'Export' }),
  rows: (page: Page) => page.locator('#login-grid .k-grid-content tr'),
  rowsByText:
    (query: string): Target =>
    (page: Page) =>
      page.locator('#login-grid .k-grid-content tr', { hasText: new RegExp(query, 'i') }),
  loginDateCells: (page: Page) => page.locator('#login-grid .k-grid-content tr td:nth-child(2)'),
  usernameCells: (page: Page) => page.locator('#login-grid .k-grid-content tr td:nth-child(4)'),
};

export const PageHistoryReportTargets = {
  route: '/Admin/Reporting/Security/PageHistory',
  dataPath: '/Admin/Reporting/Security/GetPageHistoryPage',
  userSelector: listboxByLabel('User'),
  httpMethodSelector: listboxByLabel('HTTP Method'),
  dateFilterSelector: listboxByLabel('Date'),
  fromDateControl: fromDatePicker,
  toDateControl: toDatePicker,
  exportReportLink: (page: Page) => page.getByRole('link', { name: 'Export Report' }),
  gridHeader,
  rows: gridRows,
  dateCells: (page: Page) => page.locator('#grid .k-grid-content tr td:nth-child(1)'),
  firstRowCells: (page: Page) => gridRows(page).first().getByRole('gridcell'),
};

export const RoleConfigurationsReportTargets = {
  route: '/Admin/Reporting/Security/RoleConfigurations',
  dataPath: '/Admin/Reporting/Security/GetRoleConfigurationItems',
  statusSelector: listboxByLabel('Status'),
  tierSelector: listboxByLabel('Role Tier'),
  nameFilterInput: textboxByLabel('Name Filter'),
  nameFilterClear: (page: Page) =>
    page.locator('.label:has-text("Name Filter") + .data').getByRole('textbox').getByTitle('clear'),
  exportReportLink: (page: Page) => page.getByRole('link', { name: 'Export Report' }),
  roleItemHeading:
    (roleName: string): Target =>
    (page: Page) =>
      page.locator('#role-item-container h1', { hasText: roleName }).first(),
  editRoleLink: (page: Page) => page.locator('#role-item-container').getByRole('link', { name: 'Edit' }),
};

export const SystemAdministratorListingReportTargets = {
  route: '/Admin/Reporting/Security/Listing',
  dataPath: '/Admin/Reporting/Security/GetSysadminListingPage',
  dateFilterSelector: listboxByLabel('Date'),
  fromDateControl: fromDatePicker,
  toDateControl: toDatePicker,
  gridHeader,
  rows: gridRows,
  rowByText:
    (text: string | RegExp): Target =>
    (page: Page) =>
      gridBody(page).getByRole('row', { name: text }),
  usernameCells: (page: Page) => page.locator('#grid .k-grid-content tr td:nth-child(2)'),
  exportReportLink: (page: Page) => page.getByRole('link', { name: 'Export Report' }),
};

const userUsageDialog = (page: Page) => page.getByRole('dialog', { name: 'User Usage' });

export const UserUsageReportTargets = {
  route: '/Admin/Reporting/Apps/UserUsage',
  dataPath: '/Admin/Reporting/Apps/GetUserUsagePage',
  nameInput: textboxByLabel('Filter by Name'),
  statusSelector: listboxByLabel('Filter by Status'),
  tierSelector: listboxByLabel('Filter by User Tier'),
  gridHeader,
  rows: gridRows,
  rowAt:
    (index: number): Target =>
    (page: Page) =>
      gridRows(page).nth(index),
  rowByName:
    (name: string | RegExp): Target =>
    (page: Page) =>
      gridBody(page).getByRole('row', { name }),
  usageLinkInRow:
    (name: string | RegExp): Target =>
    (page: Page) =>
      gridBody(page).getByRole('row', { name }).getByRole('link', { name: 'Usage' }),
  usernameCells: (page: Page) => page.locator('#grid .k-grid-content tr td:nth-child(2)'),
  usageDialog: {
    dialog: userUsageDialog,
    contentReferenceLink:
      (appName: string): Target =>
      (page: Page) =>
        userUsageDialog(page)
          .locator('#contentGrid')
          .getByRole('row', { name: new RegExp(appName) })
          .getByRole('link', { name: 'Link' }),
    exportLink: (page: Page) => userUsageDialog(page).getByRole('link', { name: 'Export' }),
  },
};
