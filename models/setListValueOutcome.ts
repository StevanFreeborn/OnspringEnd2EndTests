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

  clone(): SetListValueOutcome {
    return new SetListValueOutcome({
      status: this.status,
      description: this.description,
      setListValueRules: this.setListValueRules.map(r => r.clone()),
    });
  }
}

export abstract class SetListValueRule {
  fieldName: string;

  constructor({ fieldName }: { fieldName: string }) {
    this.fieldName = fieldName;
  }

  abstract clone(): SetListValueRule;
}

export class SetSingleListValueRule extends SetListValueRule {
  value: string;

  constructor({ fieldName, value }: { fieldName: string; value: string }) {
    super({ fieldName });
    this.value = value;
  }

  clone(): SetSingleListValueRule {
    return new SetSingleListValueRule({
      fieldName: this.fieldName,
      value: this.value,
    });
  }
}
