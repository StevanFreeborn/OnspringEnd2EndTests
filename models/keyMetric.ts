type KeyMetricType = 'Single Value' | 'Dial Gauge' | 'Donut Gauge' | 'Bar Gauge' | 'Bulb Gauge';

type AggregateFunction =
  | {
      fn: 'Sum' | 'Minimum' | 'Maximum' | 'Average';
      fieldToAggregate: string;
    }
  | { fn: 'Count (of Records Returned)' };

type FieldSource =
  | {
      type: 'App/Survey';
      aggregate: AggregateFunction;
    }
  | { type: 'Content Record' }
  | { type: 'Report' };

type Security =
  | {
      view: 'Public';
    }
  | { view: 'Private by Role'; roles: string[] };

type KeyMetricObject = {
  objectName: string;
  displayName?: string;
  description?: string;
  forceRefresh?: boolean;
  overridePermissions?: boolean;
  type: KeyMetricType;
  appOrSurvey: string;
  fieldSource: FieldSource;
  security?: Security;
};

export abstract class KeyMetric {
  objectName: string;
  displayName: string;
  description: string;
  forceRefresh: boolean;
  overridePermissions: boolean;
  type: KeyMetricType;
  appOrSurvey: string;
  fieldSource: FieldSource;
  security: Security;

  constructor({
    objectName,
    displayName = '',
    description = '',
    forceRefresh = false,
    overridePermissions = false,
    type,
    appOrSurvey,
    fieldSource,
    security = { view: 'Public' },
  }: KeyMetricObject) {
    this.objectName = objectName;
    this.displayName = displayName;
    this.description = description;
    this.forceRefresh = forceRefresh;
    this.overridePermissions = overridePermissions;
    this.type = type;
    this.appOrSurvey = appOrSurvey;
    this.fieldSource = fieldSource;
    this.security = security;
  }
}

type SingleValueColorDisplay =
  | {
      type: 'Do Not Display Color';
    }
  | { type: 'Selected Color'; color: string; label: string }
  | {
      type: 'Conditional Color based on Ranges';
      ranges: { label: string; rangeStop: number; color: string }[];
    };

type SingleValueKeyMetricObject = Omit<KeyMetricObject, 'type'> & {
  colorDisplay?: SingleValueColorDisplay;
};

export class SingleValueKeyMetric extends KeyMetric {
  colorDisplay: SingleValueColorDisplay;

  constructor({
    objectName,
    displayName,
    description,
    forceRefresh,
    overridePermissions,
    appOrSurvey,
    fieldSource,
    colorDisplay = { type: 'Do Not Display Color' },
    security,
  }: SingleValueKeyMetricObject) {
    super({
      objectName,
      displayName,
      description,
      forceRefresh,
      overridePermissions,
      type: 'Single Value',
      appOrSurvey,
      fieldSource,
      security,
    });
    this.colorDisplay = colorDisplay;
  }
}
