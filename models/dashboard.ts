import { ExportDashboardOptions } from './exportDashboardOptions';
import { Report, ScheduledExportCustomSchedule, ScheduledExportFrequency } from './report';

export type DashboardItem = {
  object: Report;
  row: number;
  column: number;
};

type DashboardScheduleObject = {
  sendFrequency: ScheduledExportFrequency;
  startingOn: Date;
  customSchedule?: ScheduledExportCustomSchedule;
  endingOn?: Date;
  defaultFiltering?: boolean;
  exportDashboardOptions: ExportDashboardOptions;
  specificGroups?: string[];
  specificUsers?: string[];
  fromName: string;
  fromAddress: string;
  subject: string;
  body: string;
};

export class DashboardSchedule {
  sendFrequency: ScheduledExportFrequency;
  startingOn: Date;
  customSchedule?: ScheduledExportCustomSchedule;
  endingOn?: Date;
  defaultFiltering: boolean;
  exportDashboardOptions: ExportDashboardOptions;
  specificGroups: string[];
  specificUsers: string[];
  fromName: string;
  fromAddress: string;
  subject: string;
  body: string;

  constructor({
    sendFrequency,
    startingOn,
    customSchedule,
    endingOn,
    defaultFiltering = false,
    exportDashboardOptions = new ExportDashboardOptions({}),
    specificGroups = [],
    specificUsers = [],
    fromName,
    fromAddress,
    subject,
    body,
  }: DashboardScheduleObject) {
    this.sendFrequency = sendFrequency;
    this.startingOn = startingOn;
    this.customSchedule = customSchedule;
    this.endingOn = endingOn;
    this.defaultFiltering = defaultFiltering;
    this.exportDashboardOptions = exportDashboardOptions;
    this.specificGroups = specificGroups;
    this.specificUsers = specificUsers;
    this.fromName = fromName;
    this.fromAddress = fromAddress;
    this.subject = subject;
    this.body = body;

    if (this.sendFrequency === 'Custom Schedule' && !this.customSchedule) {
      throw new Error('Custom schedule is required when send frequency is "Custom"');
    }

    if (this.specificGroups.length === 0 && this.specificUsers.length === 0) {
      throw new Error('Specific groups or users must be provided');
    }
  }
}

type DashboardObject = {
  id?: number;
  name: string;
  containers?: string[];
  items?: DashboardItem[];
  schedule?: DashboardSchedule;
};

export class Dashboard {
  id: number;
  name: string;
  containers: string[];
  items: DashboardItem[];
  schedule?: DashboardSchedule;

  constructor({ id = 0, name, containers = [], items = [], schedule }: DashboardObject) {
    this.id = id;
    this.name = name;
    this.containers = containers;
    this.items = items;
    this.schedule = schedule;
  }
}
