import { Outcome, OutcomeObject } from './outcome';

type SetDateOutcomeObject = Omit<OutcomeObject, 'type'> & {
  setDateRules?: SetDateRule[];
};

export class SetDateOutcome extends Outcome {
  setDateRules: SetDateRule[];

  constructor({ status, description, setDateRules = [] }: SetDateOutcomeObject) {
    super({ type: 'Set Date', status, description });
    this.setDateRules = setDateRules;
  }

  clone(): SetDateOutcome {
    return new SetDateOutcome({
      status: this.status,
      description: this.description,
      setDateRules: this.setDateRules.map(r => r.clone()),
    });
  }
}

export abstract class SetDateRule {
  fieldName: string;

  constructor({ fieldName }: { fieldName: string }) {
    this.fieldName = fieldName;
  }

  abstract clone(): SetDateRule;
}

export class SetDateToCurrentDateRule extends SetDateRule {
  constructor({ fieldName }: { fieldName: string }) {
    super({ fieldName });
  }

  clone(): SetDateToCurrentDateRule {
    return new SetDateToCurrentDateRule({
      fieldName: this.fieldName,
    });
  }
}
