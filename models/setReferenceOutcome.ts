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

  clone(): SetReferenceOutcome {
    return new SetReferenceOutcome({
      status: this.status,
      description: this.description,
      setReferenceConfig: this.setReferenceConfig.clone(),
    });
  }
}

export abstract class SetReferenceConfig {
  fieldName: string;

  constructor({ fieldName }: { fieldName: string }) {
    this.fieldName = fieldName;
  }

  abstract clone(): SetReferenceConfig;
}

export class SetSpecificSingleReferenceConfig extends SetReferenceConfig {
  method = 'Specific Value';
  value: string;

  constructor({ fieldName, value }: { fieldName: string; value: string }) {
    super({ fieldName });
    this.value = value;
  }

  clone(): SetSpecificSingleReferenceConfig {
    return new SetSpecificSingleReferenceConfig({
      fieldName: this.fieldName,
      value: this.value,
    });
  }
}
