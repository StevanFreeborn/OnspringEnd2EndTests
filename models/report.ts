// eslint-disable-next-line @typescript-eslint/ban-types
type ReportObject = {};
type ReportSchedulingStatus = 'Enabled' | 'Disabled';
type ReportSecurity = 'Private to me' | 'Private by Role' | 'Public';

export abstract class Report {
  constructor({}: ReportObject) {}
}

export class TempReport extends Report {
  constructor({}: ReportObject) {
    super({});
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

  constructor({ name, security = 'Private to me', scheduling = 'Disabled' }: SavedReportObject) {
    super({});
    this.name = name;
    this.security = security;
    this.scheduling = scheduling;
  }
}
