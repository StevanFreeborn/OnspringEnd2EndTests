type DashboardFilterDataType = 'Date/Time' | 'List' | 'Number' | 'Text' | 'Reference';

export type DashboardFilterFieldMapping = {
  dashboardObject: string;
  fields: string[];
};

type DashboardFilterObject = {
  label: string;
  type: DashboardFilterDataType;
  fieldMappings: DashboardFilterFieldMapping[];
};

export abstract class DashboardFilter {
  label: string;
  type: DashboardFilterDataType;
  fieldMappings: DashboardFilterFieldMapping[];

  constructor({ label, type, fieldMappings }: DashboardFilterObject) {
    this.label = label;
    this.type = type;
    this.fieldMappings = fieldMappings;
  }
}

type DateTimeDashboardFilterObject = Omit<DashboardFilterObject, 'type'>;

export class DateTimeDashboardFilter extends DashboardFilter {
  constructor({ label: filterLabel, fieldMappings }: DateTimeDashboardFilterObject) {
    super({ label: filterLabel, type: 'Date/Time', fieldMappings });
  }
}

type ListDashboardFilterObject = Omit<DashboardFilterObject, 'type'>;

export class ListDashboardFilter extends DashboardFilter {
  constructor({ label: filterLabel, fieldMappings }: ListDashboardFilterObject) {
    super({ label: filterLabel, type: 'List', fieldMappings });
  }
}

type NumberDashboardFilterObject = Omit<DashboardFilterObject, 'type'>;

export class NumberDashboardFilter extends DashboardFilter {
  constructor({ label: filterLabel, fieldMappings }: NumberDashboardFilterObject) {
    super({ label: filterLabel, type: 'Number', fieldMappings });
  }
}

type TextDashboardFilterObject = Omit<DashboardFilterObject, 'type'>;

export class TextDashboardFilter extends DashboardFilter {
  constructor({ label: filterLabel, fieldMappings }: TextDashboardFilterObject) {
    super({ label: filterLabel, type: 'Text', fieldMappings });
  }
}

type ReferenceDashboardFilterObject = Omit<DashboardFilterObject, 'type'> & {
  referencedApp: string;
};

export class ReferenceDashboardFilter extends DashboardFilter {
  referencedApp: string;

  constructor({ label: filterLabel, fieldMappings, referencedApp }: ReferenceDashboardFilterObject) {
    super({ label: filterLabel, type: 'Text', fieldMappings });
    this.referencedApp = referencedApp;
  }
}
