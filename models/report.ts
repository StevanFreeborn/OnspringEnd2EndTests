import { Chart, ChartDisplayOption, DisplayOptionLabel } from './chart';

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

type CalendarColors = 'Calendar Value Settings';

type CalendarView = 'Week' | 'Day';

type InitialCalendarDate = 'Today';

export type CalendarValue = {
  startDateField: string;
  endDateField?: string;
  color?: string;
};

type SavedReportAsCalendarObject = Omit<SavedReportObject, 'displayType'> & {
  colorBasedOn?: CalendarColors;
  defaultView?: CalendarView;
  agendaFields?: string[];
  initialDate?: InitialCalendarDate;
  calendarValues: CalendarValue[];
};

export class SavedReportAsCalendar extends SavedReport {
  colorBasedOn: CalendarColors;
  defaultView: CalendarView;
  agendaFields: string[];
  initialDate: InitialCalendarDate;
  calendarValues: CalendarValue[];

  constructor({
    appName,
    name,
    displayFields,
    relatedData,
    security,
    scheduling,
    schedule,
    colorBasedOn = 'Calendar Value Settings',
    defaultView = 'Week',
    agendaFields = [],
    initialDate = 'Today',
    calendarValues,
  }: SavedReportAsCalendarObject) {
    super({
      appName,
      name,
      displayType: 'Display as a Calendar',
      displayFields,
      relatedData,
      security,
      scheduling,
      schedule,
    });
    this.colorBasedOn = colorBasedOn;
    this.defaultView = defaultView;
    this.agendaFields = agendaFields;
    this.initialDate = initialDate;
    this.calendarValues = calendarValues;

    if (this.calendarValues.length === 0) {
      throw new Error('At least one calendar value must be provided');
    }
  }
}

type GanttChartColorBasedOn = 'Gantt Value Settings';
type GanttChartTimeFrameDisplay = 'Show all data without scrolling';
type GanttChartTimeIncrements = 'Hours' | 'Days' | 'Weeks' | 'Months' | 'Quarters' | 'Years';
export type GanttChartValue = {
  startDateField: string;
  endDateField: string;
  percentCompleteField?: string;
  dependencyField?: string;
  labelField?: string;
  legendText?: string;
  color: string;
};

type SavedReportAsGanttChartObject = Omit<SavedReportObject, 'displayType'> & {
  groupData?: string;
  rowHeaderFields?: string[];
  colorBasedOn?: GanttChartColorBasedOn;
  timeIncrements: GanttChartTimeIncrements[];
  timeFrameDisplay?: GanttChartTimeFrameDisplay;
  ganttValues: GanttChartValue[];
  milestoneField?: string;
  displayVerticalLine?: boolean;
  threeD?: boolean;
};

export class SavedReportAsGanttChart extends SavedReport {
  groupData: string;
  rowHeaderFields: string[];
  colorBasedOn: string;
  timeIncrements: string[];
  timeFrameDisplay: string;
  ganttValues: GanttChartValue[];
  milestoneField: string;
  displayOptions: ChartDisplayOption[];

  constructor({
    appName,
    name,
    displayFields,
    relatedData,
    security,
    scheduling,
    schedule,
    groupData = '',
    rowHeaderFields = [],
    colorBasedOn = 'Gantt Value Settings',
    timeIncrements,
    timeFrameDisplay = 'Show all data without scrolling',
    ganttValues,
    milestoneField = '',
    displayVerticalLine = false,
    threeD = false,
  }: SavedReportAsGanttChartObject) {
    super({
      appName,
      name,
      displayType: 'Display as a Gantt Chart',
      displayFields,
      relatedData,
      security,
      scheduling,
      schedule,
    });
    this.groupData = groupData;
    this.rowHeaderFields = rowHeaderFields;
    this.colorBasedOn = colorBasedOn;
    this.timeIncrements = timeIncrements;
    this.timeFrameDisplay = timeFrameDisplay;
    this.ganttValues = ganttValues;
    this.milestoneField = milestoneField;
    this.displayOptions = [
      {
        name: DisplayOptionLabel.displayVerticalLine,
        status: displayVerticalLine,
      },
      {
        name: DisplayOptionLabel.threeD,
        status: threeD,
      },
    ];

    if (this.timeIncrements.length === 0) {
      throw new Error('A time increment must be provided');
    }

    if (this.ganttValues.length === 0) {
      throw new Error('At least one gantt value must be provided');
    }
  }
}
