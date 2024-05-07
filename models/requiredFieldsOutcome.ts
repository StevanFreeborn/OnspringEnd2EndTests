import { Outcome, OutcomeObject } from './outcome';

type RequiredFieldsOutcomeObject = Omit<OutcomeObject, 'type'> & {
  requiredFields?: string[];
};

export class RequiredFieldsOutcome extends Outcome {
  requiredFields: string[];

  constructor({ status, description, requiredFields = [] }: RequiredFieldsOutcomeObject) {
    super({ type: 'Required Fields', status, description });
    this.requiredFields = requiredFields;
  }
}
