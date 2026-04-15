import { Outcome, OutcomeObject } from './outcome';

type FilterListValueOutcomeObject = Omit<OutcomeObject, 'type'> & {
  filterListValueRules: FilterListValueRule[];
};

export class FilterListValueOutcome extends Outcome {
  filterListValueRules: FilterListValueRule[];

  constructor({ status, description, filterListValueRules }: FilterListValueOutcomeObject) {
    super({ type: 'Filter List Values', status, description });
    this.filterListValueRules = filterListValueRules;
  }

  clone(): FilterListValueOutcome {
    return new FilterListValueOutcome({
      status: this.status,
      description: this.description,
      filterListValueRules: this.filterListValueRules.map(r => r.clone()),
    });
  }
}

export class FilterListValueRule {
  fieldName: string;
  valuesToInclude: string[];

  constructor({ fieldName, valuesToInclude }: { fieldName: string; valuesToInclude: string[] }) {
    this.fieldName = fieldName;
    this.valuesToInclude = valuesToInclude;
  }

  clone() {
    return new FilterListValueRule({
      fieldName: this.fieldName,
      valuesToInclude: [...this.valuesToInclude],
    });
  }
}
