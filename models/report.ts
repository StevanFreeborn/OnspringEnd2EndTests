type ReportSchedulingStatus = 'Enabled' | 'Disabled';
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

type ReportSchedule = {
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
  sendIfEmpty: boolean;
  includeAllLevels: boolean;
  specificGroups: string[];
  specificUsers: string[];
  fromName: string;
  fromAddress: string;
  subject: string;
  body: string;
  appendAdditionalRecipients: boolean;
};

type SavedReportObject = ReportObject & {
  name: string;
  description?: string;
  security?: ReportSecurity;
  scheduling?: ReportSchedulingStatus;
  schedule?: ReportSchedule;
};

export class SavedReport extends Report {
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

    if (this.scheduling === 'Enabled' && this.schedule === undefined) {
      throw new Error('A schedule must be provided when scheduling is enabled');
    }
  }
}

type SavedReportAsReportDataOnlyObject = SavedReportObject & {
  bulkEdit?: boolean;
  bulkDelete?: boolean;
};

export class SavedReportAsReportDataOnly extends SavedReport {
  bulkEdit: boolean;
  bulkDelete: boolean;

  constructor({
    appName,
    name,
    displayType,
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
      displayType,
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
