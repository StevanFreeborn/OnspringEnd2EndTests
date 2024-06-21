type ReportSchedulingStatus = 'Enabled' | 'Disabled';
type ReportSecurity = 'Private to me' | 'Private by Role' | 'Public';
type ReportDisplayType =
  | 'Display Report Data Only'
  | 'Display as a Chart'
  | 'Display as a Calendar'
  | 'Display as a Gantt Chart'
  | 'Display as a Map';

type ReportObject = {
  appName: string;
  displayType?: ReportDisplayType;
  displayFields?: string[];
};

export abstract class Report {
  appName: string;
  displayType: ReportDisplayType;
  displayFields: string[];

  constructor({ appName, displayType = 'Display Report Data Only', displayFields = [] }: ReportObject) {
    this.appName = appName;
    this.displayType = displayType;
    this.displayFields = displayFields;
  }
}

type TempReportObject = ReportObject;

export class TempReport extends Report {
  constructor({ appName }: TempReportObject) {
    super({ appName });
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
    displayFields,
    security = 'Private to me',
    scheduling = 'Disabled',
  }: SavedReportObject) {
    super({ appName, displayFields });
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

  constructor({ appName, name, displayFields, bulkDelete = true, bulkEdit = true }: SavedReportAsReportDataOnlyObject) {
    super({ appName, name, displayFields });
    this.bulkEdit = bulkEdit;
    this.bulkDelete = bulkDelete;
  }
}
