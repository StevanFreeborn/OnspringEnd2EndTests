type ReportSchedulingStatus = 'Enabled' | 'Disabled';
type ReportSecurity = 'Private to me' | 'Private by Role' | 'Public';
type ReportObject = {
  appName: string;
};

export abstract class Report {
  appName: string;

  constructor({ appName }: ReportObject) {
    this.appName = appName;
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

  constructor({ appName, name, security = 'Private to me', scheduling = 'Disabled' }: SavedReportObject) {
    super({ appName });
    this.name = name;
    this.security = security;
    this.scheduling = scheduling;
  }
}
