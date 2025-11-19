import { DashboardObjectItem } from './dashboardObjectItem';
import { ExportDashboardOptions } from './exportDashboardOptions';
import { KeyMetric } from './keyMetric';
import { Report, ScheduledExportCustomSchedule, ScheduledExportFrequency } from './report';

export type DashboardItem = Report | DashboardObjectItem | KeyMetric;

export type DashboardItemWithLocation = {
  item: DashboardItem;
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

type DashboardPermissions = {
  users?: string[];
  groups?: string[];
  roles?: string[];
};

type DashboardTitleObject = {
  title?: string;
  titleTextColor?: string;
  titleTextFormat?: 'Normal' | 'Bold' | 'Italic';
  titleTextAlignment?: 'Left' | 'Center' | 'Right';
  titleBackgroundColor?: string;
};

class DashboardTitle {
  title: string;
  titleTextColor: string;
  titleTextFormat: 'Normal' | 'Bold' | 'Italic';
  titleTextAlignment: 'Left' | 'Center' | 'Right';
  titleBackgroundColor: string;

  constructor({
    title = '',
    titleTextColor = '#000000',
    titleTextFormat = 'Bold',
    titleTextAlignment = 'Center',
    titleBackgroundColor = '#ffffff',
  }: DashboardTitleObject) {
    this.title = title;
    this.titleTextColor = titleTextColor;
    this.titleTextFormat = titleTextFormat;
    this.titleTextAlignment = titleTextAlignment;
    this.titleBackgroundColor = titleBackgroundColor;
  }
}

type DashboardObject = {
  id?: number;
  name: string;
  displayTitle?: boolean;
  title?: DashboardTitle;
  status?: boolean;
  containers?: string[];
  items?: DashboardItemWithLocation[];
  schedule?: DashboardSchedule;
  permissionStatus?: 'Public' | 'Private';
  permissions?: DashboardPermissions;
};

export class Dashboard {
  id: number;
  name: string;
  displayTitle: boolean;
  title: DashboardTitle;
  status: boolean;
  containers: string[];
  items: DashboardItemWithLocation[];
  schedule?: DashboardSchedule;
  permissionStatus: 'Public' | 'Private';
  permissions: {
    users: string[];
    groups: string[];
    roles: string[];
  };

  constructor({
    id = 0,
    name,
    displayTitle = true,
    title = new DashboardTitle({ title: name }),
    status = true,
    containers = [],
    items = [],
    schedule,
    permissionStatus = 'Public',
    permissions,
  }: DashboardObject) {
    this.id = id;
    this.name = name;
    this.displayTitle = displayTitle;
    this.title = title;
    this.status = status;
    this.containers = containers;
    this.items = items;
    this.schedule = schedule;
    this.permissionStatus = permissionStatus;
    this.permissions = {
      users: permissions?.users || [],
      groups: permissions?.groups || [],
      roles: permissions?.roles || [],
    };
  }
}
