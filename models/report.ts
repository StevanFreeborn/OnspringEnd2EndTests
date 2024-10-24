import { Chart } from './chart';

export type ReportSchedulingStatus = 'Enabled' | 'Disabled';
type ReportSecurity = 'Private to me' | 'Private by Role' | 'Public';
type ReportDisplayType =
  | 'Display Report Data Only'
  | 'Display as a Chart'
  | 'Display as a Calendar'
  | 'Display as a Gantt Chart'
  | 'Display as a Map';

export type RelatedData = {
  referenceField: string;
  displayFields: string[];
};

type ReportObject = {
  appName: string;
  displayType?: ReportDisplayType;
  displayFields?: string[];
  relatedData?: RelatedData[];
};

export abstract class Report {
  id?: number;
  appName: string;
  displayType: ReportDisplayType;
  displayFields: string[];
  relatedData: RelatedData[];

  constructor({
    appName,
    displayType = 'Display Report Data Only',
    displayFields = [],
    relatedData = [],
  }: ReportObject) {
    this.appName = appName;
    this.displayType = displayType;
    this.displayFields = displayFields;
    this.relatedData = relatedData;
  }
}

type TempReportObject = ReportObject;

export class TempReport extends Report {
  constructor({ appName, displayType, displayFields, relatedData }: TempReportObject) {
    super({ appName, displayType, displayFields, relatedData });
  }
}

type ReportScheduleObject = {
  sendFrequency: 'Every Day' | 'Every Weekday' | 'Every Week' | 'Every Month' | 'Every Year' | 'Custom Schedule';
  startingOn: Date;
  customSchedule?: {
    quantity: number;
    unit: 'Day(s)' | 'Week(s)' | 'Month(s)' | 'Year(s)';
  };
  endingOn?: Date;
  sendAs?: 'Attachment' | 'Link' | 'Embedded Content';
  type?: 'Microsoft Excel' | 'PDF';
  data?: 'Export Report Data'; // more options to be added. availability of options depends on the type of report
  dataFormat?: 'Excel Readability' | 'Onspring Import';
  numberDateFormat?: 'For Excel Functions or Import' | 'Onspring Display Format';
  doNotSendIfEmpty?: boolean;
  includeAllLevels?: boolean;
  specificGroups?: string[];
  specificUsers?: string[];
  fromName: string;
  fromAddress: string;
  subject: string;
  body: string;
  appendAdditionalRecipients?: boolean;
};

export class ReportSchedule {
  sendFrequency: 'Every Day' | 'Every Weekday' | 'Every Week' | 'Every Month' | 'Every Year' | 'Custom Schedule';
  startingOn: Date;
  customSchedule?: {
    quantity: number;
    unit: 'Day(s)' | 'Week(s)' | 'Month(s)' | 'Year(s)';
  };
  endingOn?: Date;
  sendAs: 'Attachment' | 'Link' | 'Embedded Content';
  type: 'Microsoft Excel' | 'PDF';
  data: 'Export Report Data'; // more options to be added. availability of options depends on the type of report
  dataFormat: 'Excel Readability' | 'Onspring Import';
  numberDateFormat: 'For Excel Functions or Import' | 'Onspring Display Format';
  doNotSendIfEmpty: boolean;
  includeAllLevels: boolean;
  specificGroups: string[];
  specificUsers: string[];
  fromName: string;
  fromAddress: string;
  subject: string;
  body: string;
  appendAdditionalRecipients: boolean;

  constructor({
    sendFrequency,
    startingOn,
    customSchedule,
    endingOn,
    sendAs = 'Attachment',
    type = 'Microsoft Excel',
    data = 'Export Report Data',
    dataFormat = 'Excel Readability',
    numberDateFormat = 'For Excel Functions or Import',
    doNotSendIfEmpty = true,
    includeAllLevels = false,
    specificGroups = [],
    specificUsers = [],
    fromName,
    fromAddress,
    subject,
    body,
    appendAdditionalRecipients = false,
  }: ReportScheduleObject) {
    this.sendFrequency = sendFrequency;
    this.startingOn = startingOn;
    this.customSchedule = customSchedule;
    this.endingOn = endingOn;
    this.sendAs = sendAs;
    this.type = type;
    this.data = data;
    this.dataFormat = dataFormat;
    this.numberDateFormat = numberDateFormat;
    this.doNotSendIfEmpty = doNotSendIfEmpty;
    this.includeAllLevels = includeAllLevels;
    this.specificGroups = specificGroups;
    this.specificUsers = specificUsers;
    this.fromName = fromName;
    this.fromAddress = fromAddress;
    this.subject = subject;
    this.body = body;
    this.appendAdditionalRecipients = appendAdditionalRecipients;

    if (this.sendFrequency === 'Custom Schedule' && this.customSchedule === undefined) {
      throw new Error('A custom schedule must be provided when the send frequency is Custom Schedule');
    }
  }
}

type SavedReportObject = ReportObject & {
  name: string;
  description?: string;
  security?: ReportSecurity;
  scheduling?: ReportSchedulingStatus;
  schedule?: ReportSchedule;
};

export abstract class SavedReport extends Report {
  name: string;
  description: string;
  security: ReportSecurity;
  scheduling: ReportSchedulingStatus;
  schedule?: ReportSchedule;

  constructor({
    appName,
    name,
    description = '',
    displayType,
    displayFields,
    relatedData,
    security = 'Private to me',
    scheduling = 'Disabled',
    schedule,
  }: SavedReportObject) {
    super({
      appName,
      displayFields,
      displayType,
      relatedData,
    });
    this.name = name;
    this.description = description;
    this.security = security;
    this.scheduling = scheduling;
    this.schedule = schedule;

    if (this.scheduling === 'Enabled') {
      if (this.schedule === undefined) {
        throw new Error('A schedule must be provided when scheduling is enabled');
      }

      if (
        this.security === 'Private to me' &&
        (this.schedule.specificGroups.length > 0 || this.schedule.specificUsers.length > 0)
      ) {
        throw new Error('Specific groups and users cannot be provided when the report is private to me');
      }

      if (
        this.security !== 'Private to me' &&
        this.schedule.specificGroups.length === 0 &&
        this.schedule.specificUsers.length === 0
      ) {
        throw new Error('Specific groups or users must be provided when the report is not private to me');
      }
    }
  }
}

type SavedReportAsReportDataOnlyObject = Omit<SavedReportObject, 'displayType'> & {
  bulkEdit?: boolean;
  bulkDelete?: boolean;
};

export class SavedReportAsReportDataOnly extends SavedReport {
  bulkEdit: boolean;
  bulkDelete: boolean;

  constructor({
    appName,
    name,
    displayFields,
    relatedData,
    security,
    scheduling,
    schedule,
    bulkDelete = true,
    bulkEdit = true,
  }: SavedReportAsReportDataOnlyObject) {
    super({
      appName,
      name,
      displayType: 'Display Report Data Only',
      displayFields,
      relatedData,
      security,
      scheduling,
      schedule,
    });
    this.bulkEdit = bulkEdit;
    this.bulkDelete = bulkDelete;
  }
}

type SavedReportAsChartObject = Omit<SavedReportObject, 'displayType'> & {
  chart: Chart;
};

export class SavedReportAsChart extends SavedReport {
  chart: Chart;

  constructor({
    appName,
    name,
    displayFields,
    relatedData,
    security,
    scheduling,
    schedule,
    chart,
  }: SavedReportAsChartObject) {
    super({
      appName,
      name,
      displayType: 'Display as a Chart',
      displayFields,
      relatedData,
      security,
      scheduling,
      schedule,
    });
    this.chart = chart;
  }
}
