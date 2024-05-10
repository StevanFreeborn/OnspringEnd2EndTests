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
}

export abstract class SetDateRule {
  fieldName: string;

  constructor({ fieldName }: { fieldName: string }) {
    this.fieldName = fieldName;
  }
}

export class SetDateToCurrentDateRule extends SetDateRule {
  constructor({ fieldName }: { fieldName: string }) {
    super({ fieldName });
  }
}
