import { Outcome, OutcomeObject } from './outcome';

type SetReferenceOutcomeObject = Omit<OutcomeObject, 'type'> & {
  setReferenceConfig: SetReferenceConfig;
};

export class SetReferenceOutcome extends Outcome {
  setReferenceConfig: SetReferenceConfig;

  constructor({ status, description, setReferenceConfig }: SetReferenceOutcomeObject) {
    super({ type: 'Set Reference', status, description });
    this.setReferenceConfig = setReferenceConfig;
  }
}

export abstract class SetReferenceConfig {
  fieldName: string;

  constructor({ fieldName }: { fieldName: string }) {
    this.fieldName = fieldName;
  }
}

export class SetSpecificSingleReferenceConfig extends SetReferenceConfig {
  method = 'Specific Value';
  value: string;

  constructor({ fieldName, value }: { fieldName: string; value: string }) {
    super({ fieldName });
    this.value = value;
  }
}
