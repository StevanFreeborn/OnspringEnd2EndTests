import { Outcome, OutcomeObject } from './outcome';

type SetListValueOutcomeObject = Omit<OutcomeObject, 'type'> & {
  setListValueRules?: SetListValueRule[];
};

export class SetListValueOutcome extends Outcome {
  setListValueRules: SetListValueRule[];

  constructor({ status, description, setListValueRules = [] }: SetListValueOutcomeObject) {
    super({ type: 'Set List Value', status, description });
    this.setListValueRules = setListValueRules;
  }
}

export abstract class SetListValueRule {
  fieldName: string;

  constructor({ fieldName }: { fieldName: string }) {
    this.fieldName = fieldName;
  }
}

export class SetSingleListValueRule extends SetListValueRule {
  value: string;

  constructor({ fieldName, value }: { fieldName: string; value: string }) {
    super({ fieldName });
    this.value = value;
  }
}
