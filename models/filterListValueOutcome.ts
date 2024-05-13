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
}

export class FilterListValueRule {
  fieldName: string;
  valuesToInclude: string[];

  constructor({ fieldName, valuesToInclude }: { fieldName: string; valuesToInclude: string[] }) {
    this.fieldName = fieldName;
    this.valuesToInclude = valuesToInclude;
  }
}
