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

type SavedReportObject = ReportObject & {
  name: string;
  security?: ReportSecurity;
  scheduling?: ReportSchedulingStatus;
};

export class SavedReport extends Report {
  name: string;
  security: ReportSecurity;
  scheduling: ReportSchedulingStatus;

  constructor({
    appName,
    name,
    displayType,
    displayFields,
    relatedData,
    security = 'Private to me',
    scheduling = 'Disabled',
  }: SavedReportObject) {
    super({
      appName,
      displayFields,
      displayType,
      relatedData,
    });
    this.name = name;
    this.security = security;
    this.scheduling = scheduling;
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
    bulkDelete = true,
    bulkEdit = true,
  }: SavedReportAsReportDataOnlyObject) {
    super({
      appName,
      name,
      displayType,
      displayFields,
      relatedData,
    });
    this.bulkEdit = bulkEdit;
    this.bulkDelete = bulkDelete;
  }
}
