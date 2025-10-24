type KeyMetricType = 'Single Value' | 'Dial Gauge' | 'Donut Gauge' | 'Bar Gauge' | 'Bulb Gauge';

type CountOfRecordsAggregateFunction = { fn: 'Count (of Records Returned)' };

type AggregateFunction =
  | {
      fn: 'Sum' | 'Minimum' | 'Maximum' | 'Average';
      fieldToAggregate: string;
    }
  | CountOfRecordsAggregateFunction;

type FieldSource =
  | {
      type: 'App/Survey';
      aggregate: AggregateFunction;
    }
  | { type: 'Content Record'; record: string; field: string }
  | { type: 'Report'; report: string; aggregate: CountOfRecordsAggregateFunction };

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

  abstract clone(): KeyMetric;
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

  clone() {
    return new SingleValueKeyMetric({
      objectName: this.objectName,
      displayName: this.displayName,
      description: this.description,
      forceRefresh: this.forceRefresh,
      overridePermissions: this.overridePermissions,
      appOrSurvey: this.appOrSurvey,
      fieldSource: this.fieldSource,
      security: this.security,
      colorDisplay: this.colorDisplay,
    });
  }
}

type ValueRange = {
  label?: string;
  rangeStop: number;
  color?: string;
};

type NeedleDisplay = 'Value as Percentage' | 'Value as Number';

type TotalSource =
  | { type: 'Static'; totalValue: number }
  | { type: 'Dynamic'; appOrSurvey: string; fieldSource: FieldSource };

type DialGaugeKeyMetricObject = Omit<KeyMetricObject, 'type'> & {
  valueRanges: ValueRange[];
  totalSource: TotalSource;
  needleDisplay?: NeedleDisplay;
  calculatedPercentageDisplay?: number;
  goalDisplay?: boolean;
};

export class DialGaugeKeyMetric extends KeyMetric {
  needleDisplay: NeedleDisplay;
  calculatedPercentageDisplay: number;
  valueRanges: ValueRange[];
  goalDisplay: boolean;
  totalSource: TotalSource;

  constructor({
    objectName,
    displayName,
    description,
    forceRefresh,
    overridePermissions,
    appOrSurvey,
    fieldSource,
    security,
    valueRanges,
    totalSource,
    needleDisplay = 'Value as Percentage',
    calculatedPercentageDisplay = 0,
    goalDisplay = false,
  }: DialGaugeKeyMetricObject) {
    super({
      objectName,
      displayName,
      description,
      forceRefresh,
      overridePermissions,
      type: 'Dial Gauge',
      appOrSurvey,
      fieldSource,
      security,
    });

    this.needleDisplay = needleDisplay;
    this.calculatedPercentageDisplay = calculatedPercentageDisplay;
    this.valueRanges = valueRanges;
    this.goalDisplay = goalDisplay;
    this.totalSource = totalSource;

    if (this.valueRanges.length < 2) {
      throw new Error('At least two color range stops are required for a Dial Gauge key metric.');
    }

    if (this.calculatedPercentageDisplay < 0 || this.calculatedPercentageDisplay > 6) {
      throw new Error('Calculated Percentage Display must be between 0 and 6.');
    }
  }

  clone(): KeyMetric {
    throw new Error('Method not implemented.');
  }
}
