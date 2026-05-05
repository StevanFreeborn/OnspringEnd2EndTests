type DashboardFilterDataType = 'Date/Time' | 'List' | 'Number' | 'Text' | 'Reference';

export type DashboardFilterFieldMapping = {
  dashboardObject: string;
  fields: string[];
};

type DashboardFilterObject = {
  filterLabel: string;
  type: DashboardFilterDataType;
  fieldMappings: DashboardFilterFieldMapping[];
};

export abstract class DashboardFilter {
  filterLabel: string;
  type: DashboardFilterDataType;
  fieldMappings: DashboardFilterFieldMapping[];

  constructor({ filterLabel, type, fieldMappings }: DashboardFilterObject) {
    this.filterLabel = filterLabel;
    this.type = type;
    this.fieldMappings = fieldMappings;
  }
}

type DateTimeDashboardFilterObject = Omit<DashboardFilterObject, 'type'>;

export class DateTimeDashboardFilter extends DashboardFilter {
  constructor({ filterLabel, fieldMappings }: DateTimeDashboardFilterObject) {
    super({ filterLabel, type: 'Date/Time', fieldMappings });
  }
}

type ListDashboardFilterObject = Omit<DashboardFilterObject, 'type'>;

export class ListDashboardFilter extends DashboardFilter {
  constructor({ filterLabel, fieldMappings }: ListDashboardFilterObject) {
    super({ filterLabel, type: 'List', fieldMappings });
  }
}

type NumberDashboardFilterObject = Omit<DashboardFilterObject, 'type'>;

export class NumberDashboardFilter extends DashboardFilter {
  constructor({ filterLabel, fieldMappings }: NumberDashboardFilterObject) {
    super({ filterLabel, type: 'Number', fieldMappings });
  }
}

type TextDashboardFilterObject = Omit<DashboardFilterObject, 'type'>;

export class TextDashboardFilter extends DashboardFilter {
  constructor({ filterLabel, fieldMappings }: TextDashboardFilterObject) {
    super({ filterLabel, type: 'Text', fieldMappings });
  }
}

type ReferenceDashboardFilterObject = Omit<DashboardFilterObject, 'type'> & {
  referencedApp: string;
};

export class ReferenceDashboardFilter extends DashboardFilter {
  referencedApp: string;

  constructor({ filterLabel, fieldMappings, referencedApp }: ReferenceDashboardFilterObject) {
    super({ filterLabel, type: 'Text', fieldMappings });
    this.referencedApp = referencedApp;
  }
}
