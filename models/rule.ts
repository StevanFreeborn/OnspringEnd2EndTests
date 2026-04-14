import { FieldType } from '../componentObjectModels/menus/addFieldTypeMenu';

type NonValueOperator = 'Is Empty' | 'Is Not Empty' | 'Changed';
type ChangeOperators = 'Changed To' | 'Changed From';
type EqualityOperators = 'Equals' | 'Does Not Equal';

type TextValueOperator = 'Starts With' | 'Contains' | 'Does Not Contain';

type ListValueOperator = 'Contains Any' | 'Excludes Any';

type AutoNumberOperator = 'Equals' | 'Does Not Equal' | 'Is Greater Than' | 'Is Less Than';

export abstract class Rule {
  readonly fieldName: string;
  readonly fieldType: FieldType;

  protected constructor({ fieldName, fieldType }: { fieldName: string; fieldType: FieldType }) {
    this.fieldName = fieldName;
    this.fieldType = fieldType;
  }

  abstract clone(): Rule;
}

export class TextRule extends Rule {
  readonly operator: NonValueOperator;

  constructor({ fieldName, operator }: { fieldName: string; operator: NonValueOperator }) {
    super({ fieldName, fieldType: 'Text' });
    this.operator = operator;
  }

  clone(): TextRule {
    return new TextRule({
      fieldName: this.fieldName,
      operator: this.operator,
    });
  }
}

export class TextRuleWithValue extends Rule {
  readonly operator: TextValueOperator | ChangeOperators | EqualityOperators;
  readonly value: string;

  constructor({
    fieldName,
    operator,
    value,
  }: {
    fieldName: string;
    operator: TextValueOperator | ChangeOperators | EqualityOperators;
    value: string;
  }) {
    super({ fieldName, fieldType: 'Text' });
    this.operator = operator;
    this.value = value;
  }

  clone(): TextRuleWithValue {
    return new TextRuleWithValue({
      fieldName: this.fieldName,
      operator: this.operator,
      value: this.value,
    });
  }
}

export class DateRule extends Rule {
  readonly operator: NonValueOperator;

  constructor({ fieldName, operator }: { fieldName: string; operator: NonValueOperator }) {
    super({ fieldName, fieldType: 'Date/Time' });
    this.operator = operator;
  }

  clone(): DateRule {
    return new DateRule({
      fieldName: this.fieldName,
      operator: this.operator,
    });
  }
}

export class ListRule extends Rule {
  readonly operator: NonValueOperator;

  constructor({ fieldName, operator }: { fieldName: string; operator: NonValueOperator }) {
    super({ fieldName, fieldType: 'List' });
    this.operator = operator;
  }

  clone(): ListRule {
    return new ListRule({
      fieldName: this.fieldName,
      operator: this.operator,
    });
  }
}

export class ListRuleWithValues extends Rule {
  readonly operator: ListValueOperator | ChangeOperators | EqualityOperators;
  readonly values: string[];

  constructor({
    fieldName,
    operator,
    values,
  }: {
    fieldName: string;
    operator: ListValueOperator | ChangeOperators | EqualityOperators;
    values: string[];
  }) {
    super({ fieldName, fieldType: 'List' });
    this.operator = operator;
    this.values = values;
  }

  clone(): ListRuleWithValues {
    return new ListRuleWithValues({
      fieldName: this.fieldName,
      operator: this.operator,
      values: [...this.values],
    });
  }
}

export class AutoNumberRuleWithValue extends Rule {
  operator: Exclude<AutoNumberOperator, 'Is Between'>;
  value: number;

  constructor({
    fieldName,
    operator,
    value,
  }: {
    fieldName: string;
    operator: Exclude<AutoNumberOperator, 'Is Between'>;
    value: number;
  }) {
    super({ fieldName, fieldType: 'Number' });
    this.operator = operator;
    this.value = value;
  }

  clone(): AutoNumberRuleWithValue {
    return new AutoNumberRuleWithValue({
      fieldName: this.fieldName,
      operator: this.operator,
      value: this.value,
    });
  }
}

export class AutoNumberRuleWithRange extends Rule {
  operator: Extract<AutoNumberOperator, 'Is Between'>;
  start: number;
  end: number;

  constructor({
    fieldName,
    operator,
    start,
    end,
  }: {
    fieldName: string;
    operator: Extract<AutoNumberOperator, 'Is Between'>;
    start: number;
    end: number;
  }) {
    super({ fieldName, fieldType: 'Number' });
    this.operator = operator;
    this.start = start;
    this.end = end;
  }

  clone(): AutoNumberRuleWithRange {
    return new AutoNumberRuleWithRange({
      fieldName: this.fieldName,
      operator: this.operator,
      start: this.start,
      end: this.end,
    });
  }
}

// Preserving this for reference
// type DateValueOperator = 'Before' | 'After' | 'On or Before' | 'On or After';
// type DateValuesOperator = 'Between';
// type DateUnitValueOperator = 'Is Within Next' | 'Is Within Prior' | 'Is Older Than';

// type NumberValueOperator = 'Is Greater Than' | 'Is Less Than' | 'Between';

// type ListOrReferenceValueOperator =
//   | 'Contains Any'
//   | 'Contains All'
//   | 'Contains Exactly'
//   | 'Excludes Any'
//   | 'Excludes All'
//   | 'Excludes Exactly';

// type DateEqualOption =
//   | 'Today'
//   | 'Current Week'
//   | 'Current Month'
//   | 'Current Quarter'
//   | 'Current Year'
//   | 'Week To Date'
//   | 'Month To Date'
//   | 'Quarter To Date'
//   | 'Year To Date'
//   | 'Last Week'
//   | 'Last Month'
//   | 'Last Quarter'
//   | 'Last Year'
//   | 'Specific Date';

// type Rule =
//   | {
//       fieldName: string;
//       fieldType: 'Attachment' | 'Image' | 'Time Span';
//       operator: Exclude<NonValueOperator, 'Changed'>;
//     }
//   | {
//       fieldName: string;
//       fieldType: 'Date/Time' | 'Text' | 'Number' | 'List' | 'Reference';
//       operator: NonValueOperator;
//     }
//   | {
//       fieldName: string;
//       fieldType: 'Date/Time';
//       operator: DateValueOperator;
//       value: 'Today' | Date;
//     }
//   | {
//       fieldName: string;
//       fieldType: 'Date/Time';
//       operator: ChangeOperators;
//       value: Date;
//     }
//   | {
//       fieldName: string;
//       fieldType: 'Date/Time';
//       operator: Extract<EqualityOperators, 'Does Not Equal'>;
//       value: Date;
//     }
//   | {
//       fieldName: string;
//       fieldType: 'Date/Time';
//       operator: Extract<EqualityOperators, 'Equals'>;
//       value: DateEqualOption | Date;
//     }
//   | {
//       fieldName: string;
//       fieldType: 'Date/Time';
//       operator: DateValuesOperator;
//       startValue: Date;
//       endValue: Date;
//     }
//   | {
//       fieldName: string;
//       fieldType: 'Date/Time';
//       operator: DateUnitValueOperator;
//       value: number;
//       unit: 'Days' | 'Weeks' | 'Months' | 'Years';
//     }
//   | {
//       fieldName: string;
//       fieldType: 'Text';
//       operator: TextValueOperator | ChangeOperators | EqualityOperators;
//       value: string;
//     }
//   | {
//       fieldName: string;
//       fieldType: 'Number';
//       operator: NumberValueOperator | ChangeOperators | EqualityOperators;
//       value: number;
//     }
//   | {
//       fieldName: string;
//       fieldType: 'List';
//       operator: ListOrReferenceValueOperator | ChangeOperators | EqualityOperators;
//       value: string[];
//     }
//   | {
//       fieldName: string;
//       fieldType: 'Reference';
//       operator: ListOrReferenceValueOperator | ChangeOperators | EqualityOperators;
//       value: string[];
//     };
